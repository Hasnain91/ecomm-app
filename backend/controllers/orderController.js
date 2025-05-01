const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");
const sendEmail = require("../utils/sendEmail");
const refundSuccessEmail = require("../utils/emails/refundSuccessEmail");
const orderInitiatedStripeEmail = require("../utils/emails/orderInitiatedStripe");
const codOrderConfirmationEmail = require("../utils/emails/codOrderConfirmation");
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
      html: codOrderConfirmationEmail({ address, items, amount }),
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

    // 6. Send confirmation email (optional)
    const { subject, html } = orderInitiatedStripeEmail(
      address,
      items,
      totalAmount
    );
    await sendEmail({
      to: address.email,
      subject,
      html,
    });

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
          await sendEmail({
            to: order.address.email,
            subject: "Your Order Has Been Cancelled & Refunded",
            html: refundSuccessEmail({
              address: order.address,
              items: order.items,
              amount: order.amount,
            }),
          });
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
