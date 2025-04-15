const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");

// Nodemailer transporter configure
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
    const mailOptions = {
      from: `"FOREVER" <${process.env.EMAIL_USER}>`,
      to: address.email, // User's email from the address object
      subject: "Order Confirmation - Cash on Delivery",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Thank You for Your Order!</h1>
            <p>Hello ${address.firstName} ${address.lastName},</p>
            <p>We have received your order and it will be delivered to:</p>
            <p><strong>Address:</strong> ${address.street}, ${address.city}, ${
        address.state
      }, ${address.zipcode}, ${address.country}</p>
            <p><strong>Phone:</strong> ${address.phone}</p>
            <p>Your payment method is <strong>Cash on Delivery</strong>. Payment will be collected upon delivery.</p>
            <h3>Order Details:</h3>
            <ul>
              ${items
                .map(
                  (item) =>
                    `<li>${item.name} (${item.size}) x ${item.quantity}</li>`
                )
                .join("")}
            </ul>
            <p><strong>Total Amount:</strong> $${amount}</p>
            <p>If you have any questions, feel free to contact us at <a href="mailto:support@forever.com">support@forever.com</a>.</p>
            <p>Best regards,<br>FOREVER Shop</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

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
    // console.log(`items array in the bakend is ${items}`);

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
    // totalAmount += deliveryCharges;

    // 3. Validate totalAmount
    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Final amount must be greater than 0",
      });
    }

    // 4. Create Payment Intent
    const stripeAmount = Math.round(totalAmount * 100); // Stripe uses cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: "usd",
      metadata: {
        orderId: "temp", // Temporary placeholder; updated after saving the order
      },
    });

    // 5. Create and save order (not yet paid)
    const orderData = {
      userId,
      items: detailedItems,
      amount: totalAmount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      paymentIntentId: paymentIntent.id,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Update the Payment Intent metadata with the actual order ID
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: { orderId: newOrder._id.toString() },
    });

    // 6. Create Stripe checkout session
    // const stripeAmount = Math.round(totalAmount * 100); // Stripe uses cents
    const session = await stripe.checkout.sessions.create({
      // payment_intent: paymentIntent.id, // Link the Payment Intent to the session
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: coupon ? "Items Total (after discount)" : "Items Total",
            },
            // unit_amount: Math.round((totalAmount - deliveryCharges) * 100),
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Delivery Fee",
            },
            unit_amount: Math.round(deliveryCharges * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        metadata: {
          orderId: newOrder._id.toString(), // Attach metadata to the Payment Intent
        },
      },
    });

    // 7. Send confirmation email (optional before payment)
    const mailOptions = {
      from: `"FOREVER" <${process.env.EMAIL_USER}>`,
      to: address.email,
      subject: "Order Initiated - Awaiting Payment",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; color: #000000; border: 1px solid #e0e0e0; padding: 30px; border-radius: 8px;">
    <h2 style="text-align: center; border-bottom: 1px solid #000000; padding-bottom: 10px;">FOREVER</h2>
    <p style="font-size: 16px;">Hello <strong>${address.firstName} ${
        address.lastName
      }</strong>,</p>
    <p style="font-size: 15px;">You've initiated an order with <strong>FOREVER</strong>. Please complete the payment via Stripe.</p>
    
    <h3 style="margin-top: 30px; font-size: 18px; border-bottom: 1px solid #000000; padding-bottom: 5px;">Order Summary</h3>
    <ul style="list-style: none; padding: 0; margin-top: 15px;">
      ${detailedItems
        .map(
          (item) =>
            `<li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
              <span style="font-weight: bold;">${item.name}</span> (${item.size}) × ${item.quantity}
            </li>`
        )
        .join("")}
    </ul>

    <div style="margin-top: 25px; padding: 15px; background-color: #f9f9f9; border-radius: 6px;">
      <div style="display: flex; justify-content: space-between; font-size: 15px; padding: 5px 0;">
        <span><strong>Subtotal:${" "} </strong></span>
        <span>$${totalAmount.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 15px; padding: 5px 0;">
        <span><strong>Delivery Fee:${" "} </strong></span>
        <span>$${deliveryCharges.toFixed(2)}</span>
      </div>
      <hr style="border: none; border-top: 1px solid #000000; margin: 15px 0;" />
      <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
        <span>Total: ${" "}</span>
        <span>$${(totalAmount + deliveryCharges).toFixed(2)}</span>
      </div>
    </div>

    <p style="text-align: center; margin-top: 40px; font-size: 14px;">Thanks for shopping with us!</p>
    <p style="text-align: center; font-size: 12px; color: #888;">FOREVER | www.forever.com</p>
  </div>
`,
    };

    await transporter.sendMail(mailOptions);

    // 8. Respond with session URL
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
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      res.status(200).json({ success: true });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.status(200).json({ success: false });
    }
  } catch (error) {
    console.log("Error in verifyStripe controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Cancel Order and Process Refund
// const cancelOrder = async (req, res) => {
//   console.log("Cancel Order Controller is hit!!");
//   const { orderId } = req.body; // Get the order ID from the request body
//   // const token = req.headers.token; // Ensure the admin is authenticated
//   console.log("Initiating cancellation for order:", orderId);

//   try {
//     // Fetch the order from the database
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });
//     }
//     console.log("Order payment method:", order.paymentMethod);
//     console.log("PaymentIntent ID:", order.paymentIntentId);

//     // Check if the order is already cancelled
//     if (order.status === "Cancelled") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Order already cancelled" });
//     }

//     // Update the order status to "Cancelled"
//     order.status = "Cancelled";
//     await order.save();

//     // If the order was paid via Stripe, initiate a refund
//     if (order.paymentMethod === "stripe" && order.paymentIntentId) {
//       try {
//         // Retrieve the payment intent from Stripe
//         const paymentIntent = await stripe.paymentIntents.retrieve(
//           order.paymentIntentId
//         );

//         // Check if the payment intent is eligible for a refund
//         console.log("Stripe Payment Intent Status:", paymentIntent.status);
//         if (paymentIntent.status === "succeeded") {
//           // Create a refund for the payment intent
//           const refund = await stripe.refunds.create({
//             payment_intent: order.paymentIntentId,
//           });

//           // Log the refund details
//           console.log("Refund created:", refund.id);
//         }
//       } catch (stripeError) {
//         console.error("Stripe refund error:", stripeError);
//         return res
//           .status(500)
//           .json({ success: false, message: "Failed to process refund" });
//       }
//     }

//     // Respond with success
//     res
//       .status(200)
//       .json({ success: true, message: "Order cancelled successfully" });
//   } catch (error) {
//     console.error("Error in cancelOrder controller:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// Cancel Order and Process Refund
const cancelOrder = async (req, res) => {
  const { orderId } = req.body;

  console.log("✅ Hit the route");
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.log("❌ Order not found");
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    console.log("🔥 Cancel Order Controller is hit!!");
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

    // if (order.paymentMethod === "stripe" && order.paymentIntentId) {
    if (order.paymentMethod === "Stripe" && order.paymentIntentId) {
      console.log("💡 Entered Stripe Refund Block");
      try {
        console.log("📦 Fetching Payment Intent from Stripe...");
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

// module.exports = { cancelOrder };

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
    const ordersAdmin = await Order.find(query).skip(skip).limit(Number(limit));

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
    const orders = await Order.find({ userId });

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
