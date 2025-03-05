const express = require("express");
const {
  loginUser,
  registerUser,
  adminLogin,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", adminLogin);

module.exports = router;
