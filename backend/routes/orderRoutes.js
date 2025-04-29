// const express = require("express");
// const {
//   placeOrderCOD,
//   placeOrderStripe,
//   verifyStripe,
//   getAllOrders,
//   userOrders,
//   updateOrderStatus,
//   cancelOrder,
// } = require("../controllers/orderController");
// const adminAuth = require("../middleware/adminAuth");
// const authenticateUser = require("../middleware/userAuth");

// const router = express.Router();

// // Admin Features
// router.post("/list", adminAuth, getAllOrders);
// router.post("/status", adminAuth, updateOrderStatus);

// // Payment Features
// router.post("/place-order-cod", authenticateUser, placeOrderCOD);
// router.post("/place-order-stripe", authenticateUser, placeOrderStripe);

// // User Features
// router.post("/user-orders", authenticateUser, userOrders);

// //Verify Payment
// router.post("/verify-stripe", authenticateUser, verifyStripe);

// // Refund if stripe cancelled
// router.post(
//   "/refund",
//   (req, res, next) => {
//     console.log("✅ Hit the route");
//     next();
//   },
//   adminAuth,
//   cancelOrder
// );

// module.exports = router;

const express = require("express");
const {
  placeOrderCOD,
  placeOrderStripe,
  verifyStripe,
  getAllOrders,
  userOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const adminAuth = require("../middleware/adminAuth");
const authenticateUser = require("../middleware/userAuth");
const Stripe = require("stripe");
const Order = require("../models/orderModel");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Admin Features
router.post("/list", adminAuth, getAllOrders);
router.post("/status", adminAuth, updateOrderStatus);

// Payment Features
router.post("/place-order-cod", authenticateUser, placeOrderCOD);
router.post("/place-order-stripe", authenticateUser, placeOrderStripe);

// User Features
router.post("/user-orders", authenticateUser, userOrders);

// Verify Payment
router.post("/verify-stripe", authenticateUser, verifyStripe);

// Refund if stripe cancelled
router.post(
  "/refund",
  (req, res, next) => {
    console.log("✅ Hit the route");
    next();
  },
  adminAuth,
  cancelOrder
);

module.exports = router;
