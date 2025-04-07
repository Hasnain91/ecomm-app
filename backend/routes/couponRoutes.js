const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
  addCoupon,
  deleteCoupon,
  updateCoupon,
  getCoupons,
  getCoupon,
  applyCoupon,
} = require("../controllers/couponController");

const router = express.Router();

router.post("/add", adminAuth, addCoupon);
router.delete("/delete/:id", adminAuth, deleteCoupon);
router.put("/update/:id", adminAuth, updateCoupon);
router.get("/all", adminAuth, getCoupons);
router.get("/:id", adminAuth, getCoupon);
router.post("/apply", applyCoupon);

module.exports = router;
