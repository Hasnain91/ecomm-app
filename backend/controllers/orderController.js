const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");

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
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    // Save order to the database
    const newOrder = new Order(orderData);

    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    // Send confirmation email for Stripe
    const mailOptions = {
      from: `"FOREVER" <${process.env.EMAIL_USER}>`,
      to: address.email, // User's email from the address object
      subject: "Order Confirmation - Payment Received",
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
            <p>We have received your payment and your order will be delivered to:</p>
            <p><strong>Address:</strong> ${address.street}, ${address.city}, ${
        address.state
      }, ${address.zipcode}, ${address.country}</p>
            <p><strong>Phone:</strong> ${address.phone}</p>
            <p>Your payment of <strong>$${amount}</strong> has been successfully processed.</p>
            <h3>Order Details:</h3>
            <ul>
              ${items
                .map(
                  (item) =>
                    `<li>${item.name} (${item.size}) x ${item.quantity}</li>`
                )
                .join("")}
            </ul>
            <p>If you have any questions, feel free to contact us at <a href="mailto:support@your-website.com">support@FOREVER-shop.com</a>.</p>
            <p>Best regards,<br>FOREVER Shop</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Error in placeOrderStripe controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
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

// get all orders to display on admin panel
const getAllOrders = async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  try {
    let skip = (page - 1) * limit;
    if (skip < 0) skip = 0;
    const query = {};
    if (q) {
      query.$or = [
        { "address.firstName": { $regex: q, $options: "i" } }, // Case-insensitive match for firstName
        { "address.lastName": { $regex: q, $options: "i" } }, // Case-insensitive match for lastName
        { "address.phone": { $regex: q, $options: "i" } }, // Case-insensitive match for phone
      ];
    }
    const ordersAdmin = await Order.find(query).skip(skip).limit(Number(limit));
    const allOrders = await Order.find({});
    const totalOrderds = await Order.countDocuments(query);
    res.status(200).json({
      success: true,
      ordersAdmin,
      allOrders,
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
};
