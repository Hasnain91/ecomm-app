const express = require("express");
const {
  sendMessage,
  getMessages,
  updateMessageStatus,
} = require("../controllers/messageController");
// const { protect, admin } = require("../middleware/authMiddleware"); // Middleware for authentication and admin role
const adminAuth = require("../middleware/adminAuth");
const userAuth = require("../middleware/userAuth");

const router = express.Router();

// POST /api/messages/send - Send a message to the admin
// router.post("/send", userAuth, sendMessage);
router.post("/send", sendMessage);

// GET /api/messages - Get all messages (Admin only)
router.get("/", userAuth, adminAuth, getMessages);

// PUT /api/messages/:id - Update message status (Admin only)
router.put("/:id", userAuth, adminAuth, updateMessageStatus);

module.exports = router;
