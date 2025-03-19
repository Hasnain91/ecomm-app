const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
  loginUser,
  registerUser,
  adminLogin,
  getUsers,
  updateUserStatus,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", adminLogin);
router.get("/all-users", getUsers);
router.post("/update-status", adminAuth, updateUserStatus);

module.exports = router;
