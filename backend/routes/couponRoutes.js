const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
  addCoupon,
  deleteCoupon,
  updateCoupon,
  getCoupons,
} = require("../controllers/couponController");

const router = express.Router();

router.post("/add", addCoupon);
router.delete("/delete/:id", deleteCoupon);
router.put("/update/:id", updateCoupon);
router.get("/all", getCoupons);

module.exports = router;
