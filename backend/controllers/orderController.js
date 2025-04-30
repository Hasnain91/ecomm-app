const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");
const sendEmail = require("../utils/sendEmail");

const currency = "usd";
const deliveryCharges = 10;

// STripe Gateway Initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Palcing orders using COD Method
const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    // Save order to the database
    const newOrder = new Order(orderData);

    await newOrder.save();

    // Send confirmation email for COD
    await sendEmail({
      to: address.email,
      subject: "Order Confirmation - Cash on Delivery",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation - FOREVER Shop</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f6f6f6;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #333333;
    }
    .content p {
      line-height: 1.6;
      color: #555555;
    }
    .order-details {
      margin-top: 20px;
    }
    .order-details ul {
      padding-left: 20px;
    }
    .order-details li {
      margin-bottom: 8px;
    }
    .total {
      font-size: 18px;
      font-weight: bold;
      margin-top: 10px;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #888888;
      text-align: center;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Your Order!</h1>
    </div>
    <div class="content">
      <p>Hi ${address.firstName} ${address.lastName},</p>

      <p>We're excited to let you know that we've received your order and it's being processed.</p>

      <p><strong>Delivery Address:</strong><br/>
        ${address.street},<br/>
        ${address.city}, ${address.state} ${address.zipcode},<br/>
        ${address.country}<br/>
        <strong>Phone:</strong> ${address.phone}
      </p>

      <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>

      <div class="order-details">
        <h3>Order Summary:</h3>
        <ul>
          ${items
            .map(
              (item) =>
                `<li>${item.name} (${item.size}) × ${item.quantity}</li>`
            )
            .join("")}
        </ul>
        <p class="total">Total Amount: $${amount}</p>
      </div>

      <p>If you have any questions, reach out to our support team at 
        <a href="mailto:support@forever.com">support@forever.com</a>.
      </p>

      <p>Thank you for shopping with us!<br/>
      — The FOREVER Shop Team</p>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} FOREVER Shop. All rights reserved.
    </div>
  </div>
</body>
</html>
`,
    });

    res
      .status(200)
      .json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log("Error in placeOrderCOD controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// Palcing orders using Stripe Method

const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address, coupon } = req.body;
    const { origin } = req.headers;

    // 1. Validate items and calculate total securely
    let totalAmount = 0;
    const detailedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      const price = product.price;
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      detailedItems.push({
        name: product.name,
        quantity: item.quantity,
        size: item.size,
        price,
      });
    }

    // 2. Apply coupon if provided
    if (coupon) {
      const couponDetails = await Coupon.findOne({ code: coupon });
      if (
        !couponDetails ||
        !couponDetails.isActive ||
        (couponDetails.expirationDate &&
          couponDetails.expirationDate < Date.now())
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired coupon" });
      }

      if (couponDetails.discountType === "percentage") {
        totalAmount = parseFloat(
          (totalAmount * (1 - couponDetails.discountValue / 100)).toFixed(2)
        );
      } else if (couponDetails.discountType === "fixed") {
        totalAmount = parseFloat(
          (totalAmount - couponDetails.discountValue).toFixed(2)
        );
      }
    }

    // Add delivery fee after discount
    totalAmount += deliveryCharges; // <-- You commented this before, but you should add it before checkout

    // 3. Validate totalAmount
    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Final amount must be greater than 0",
      });
    }

    // 4. Create and save order (not yet paid)
    const orderData = {
      userId,
      items: detailedItems,
      amount: totalAmount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      paymentIntentId: "", // <- we'll update it in webhook
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // 5. Create Stripe checkout session (NO manual paymentIntent)
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: coupon ? "Items Total (after discount)" : "Items Total",
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        orderId: newOrder._id.toString(), // attach order ID to session metadata
      },
    });
    // dkfopdkfopd.populate(user_id, name).populate("produt");
    // debugger;
    // 6. Send confirmation email (optional)
    await sendEmail({
      to: address.email,
      subject: "Order Initiated - Awaiting Payment",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Initiated - FOREVER Shop</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f7fc;
    }
    .container {
      max-width: 650px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #e0e0e0;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #2b2d42;
      font-size: 28px;
    }
    .content {
      color: #555555;
      line-height: 1.6;
    }
    .content p {
      font-size: 16px;
    }
    .order-summary {
      margin-top: 30px;
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
    }
    .order-summary h3 {
      font-size: 18px;
      color: #333333;
      margin-bottom: 10px;
    }
    .order-summary ul {
      list-style: none;
      padding-left: 0;
    }
    .order-summary li {
      font-size: 16px;
      margin-bottom: 8px;
    }
    .total-amount {
      font-size: 18px;
      font-weight: bold;
      color: #2b2d42;
      margin-top: 15px;
    }
    .cta-button {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 20px;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 20px;
    }
    .cta-button:hover {
      background-color: #0056b3;
    }
    .footer {
      margin-top: 40px;
      font-size: 12px;
      color: #888888;
      text-align: center;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Your Order!</h1>
    </div>
    <div class="content">
      <p>Hi ${address.firstName} ${address.lastName},</p>

      <p>We are excited to let you know that your order has been successfully placed! Your payment is currently being processed via <strong>Stripe</strong>.</p>

      <p><strong>Delivery Address:</strong><br/>
        ${address.street}, ${address.city}, ${address.state}, ${
        address.zipcode
      }, ${address.country}<br/>
        <strong>Phone:</strong> ${address.phone}
      </p>

      <p><strong>Payment Method:</strong> Stripe (Awaiting Payment)</p>

      <div class="order-summary">
        <h3>Order Summary:</h3>
        <ul>
          ${items
            .map(
              (item) =>
                `<li>${item.name} (${item.size}) × ${item.quantity}</li>`
            )
            .join("")}
        </ul>
        <p class="total-amount">Total Amount: $${totalAmount}</p>
      </div>

      <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:support@forever.com">support@forever.com</a>.</p>

      <p>Once your payment is successfully processed, we'll send you another email to confirm the status of your order. Thank you for shopping with us!</p>

      <a href="https://forever.com" class="cta-button">Visit Our Store</a>

      <p>Best regards,<br/>
      The FOREVER Shop Team</p>
    </div>

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} FOREVER Shop. All rights reserved.</p>
      <p>If you did not place this order, please contact our support immediately.</p>
    </div>
  </div>
</body>
</html>
`,
    });

    // await transporter.sendMail(mailOptions);

    // 7. Respond with session URL
    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in placeOrderStripe controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// Verify stripe payment
const verifyStripe = async (req, res) => {
  const { success, orderId } = req.body;

  try {
    if (success === "false") {
      await Order.findByIdAndDelete(orderId);
      return res.status(200).json({ success: false });
    }

    // For success=true, do nothing — wait for webhook
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in verifyStripe controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// Cancel Order and Process Refund
const cancelOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.log("❌ Order not found");
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    console.log("Initiating cancellation for order:", order._id);
    console.log("Order payment method:", order.paymentMethod);
    console.log("PaymentIntent ID:", order.paymentIntentId);

    // Already cancelled?
    if (order.status === "Cancelled") {
      console.log("⚠️ Order already cancelled");
      return res
        .status(400)
        .json({ success: false, message: "Order already cancelled" });
    }

    // Update order status first
    order.status = "Cancelled";
    await order.save();

    // Handle Stripe Refund
    console.log("🔑 Stripe Secret Key (TEMP):", process.env.STRIPE_SECRET_KEY);

    if (order.paymentMethod === "Stripe" && order.paymentIntentId) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          order.paymentIntentId
        );
        console.log("Payment Intent Retrieved:", paymentIntent.id);
        console.log("Payment Intent Status:", paymentIntent.status);

        if (paymentIntent.status === "succeeded") {
          const refund = await stripe.refunds.create({
            payment_intent: order.paymentIntentId,
          });
          console.log("✅ Refund created:", refund.id);
        } else {
          console.log("⚠️ Payment Intent not succeeded, refund skipped.");
        }
      } catch (stripeError) {
        console.error("❌ Stripe refund error:", stripeError);
        return res
          .status(500)
          .json({ success: false, message: "Failed to process refund" });
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("❌ Error in cancelOrder controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// get all orders to display on admin panel
const getAllOrders = async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  try {
    let skip = (page - 1) * limit;
    if (skip < 0) skip = 0;

    const query = {};
    if (q) {
      query.$or = [
        { "address.firstName": { $regex: q, $options: "i" } },
        { "address.lastName": { $regex: q, $options: "i" } },
        { "address.phone": { $regex: q, $options: "i" } },
      ];
    }

    const ordersAdmin = await Order.find(query)
      .skip(skip)
      .limit(Number(limit))
      .populate("userId", "name email"); // only fetch name & email for efficiency

    const totalOrderds = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      ordersAdmin,
      totalOrderds,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrderds / limit),
    });
  } catch (error) {
    console.log("Error in getAllOrders controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// user order data for forntend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({ userId }).populate(
      "userId",
      "name email"
    );

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("Error in userOrders controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// update order status from admin panel
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });

    res.status(200).json({ success: true, message: "Status Updated!!" });
  } catch (error) {
    console.log("Error in userOrders controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

module.exports = {
  placeOrderCOD,
  placeOrderStripe,
  getAllOrders,
  userOrders,
  updateOrderStatus,
  verifyStripe,
  cancelOrder,
};
