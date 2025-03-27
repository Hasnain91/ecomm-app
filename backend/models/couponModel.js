const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  minPurchase: { type: Number, default: 0 }, // Optional
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
