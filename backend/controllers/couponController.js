const Coupon = require("../models/couponModel");

// add a coupon to the db
const addCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minPurchase, expiryDate } =
      req.body;

    // Validate required fields
    if (!code || !discountType || !discountValue || !expiryDate) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code already exists" });
    }

    // Create a new coupon
    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      minPurchase: minPurchase || 0, // Default to 0 if not provided
      expiryDate,
    });

    await newCoupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon added successfully",
      coupon: newCoupon,
    });
  } catch (error) {
    console.error("Error adding coupon:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a coupon
const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon Not Found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully!" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Update a coupon in the db
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon Not Found" });
    }
    // Update the coupon fields
    Object.keys(updates).forEach((key) => {
      if (key in coupon) {
        coupon[key] = updates[key];
      }
    });
    await coupon.save();

    res
      .status(200)
      .json({ success: true, message: "Coupon Updated Successfully", coupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Get all the coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});

    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error("Error getting coupons:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addCoupon,
  deleteCoupon,
  updateCoupon,
  getCoupons,
};
