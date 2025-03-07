const express = require("express");
const {
  addToCart,
  updateCart,
  getUserCart,
} = require("../controllers/cartController");
const authenticateUser = require("../middleware/userAuth");

const router = express.Router();

router.post("/get", authenticateUser, getUserCart);
router.post("/add", authenticateUser, addToCart);
router.post("/update", authenticateUser, updateCart);

module.exports = router;
