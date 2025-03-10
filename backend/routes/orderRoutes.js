const express = require("express");
const {
  placeOrderCOD,
  placeOrderStripe,
  verifyStripe,
  getAllOrders,
  userOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const adminAuth = require("../middleware/adminAuth");
const authenticateUser = require("../middleware/userAuth");

const router = express.Router();

// Admin Features
router.post("/list", adminAuth, getAllOrders);
router.post("/status", adminAuth, updateOrderStatus);

// Payment Features
router.post("/place-order-cod", authenticateUser, placeOrderCOD);
router.post("/place-order-stripe", authenticateUser, placeOrderStripe);

// User Features
router.post("/user-orders", authenticateUser, userOrders);

//Verify Payment
router.post("/verify-stripe", authenticateUser, verifyStripe);

module.exports = router;
