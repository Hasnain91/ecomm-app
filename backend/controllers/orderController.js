const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Stripe = require("stripe");

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

    // Clear the user cart after the order has been placed
    await User.findByIdAndUpdate(userId, { cartData: {} });

    res
      .status(200)
      .json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log("Error in placeOrderCOD controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// Palcing orders using Stripe Method
const placeOrderStripe = async (req, res) => {};

// get all orders to display on admin panel
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json({ success: true, orders });
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
};
