const Coupon = require("../models/couponModel");

// add a coupon to the db
const addCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      isActive,
      minPurchase,
      expiryDate,
    } = req.body;

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
      isActive,
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

//Get single  coupon
const getCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon Not Found" });
    }

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    console.error("Error getting coupons:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Apply a coupon

const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    // Validate required fields
    if (!code || !cartTotal) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Coupon code and cart total are required",
        });
    }

    // Find the coupon in the database
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid coupon code" });
    }

    // Check if the coupon is active and not expired
    if (!coupon.isActive || new Date() > coupon.expiryDate) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon is expired or inactive" });
    }

    // Check if the cart total meets the minimum purchase requirement
    if (cartTotal < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum cart amount of $${coupon.minPurchase} required to apply this coupon`,
      });
    }

    // Calculate the discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }

    // Calculate the new total
    const newTotal = cartTotal - discount;

    // Return the response
    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount,
      },
      newTotal,
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addCoupon,
  deleteCoupon,
  updateCoupon,
  getCoupons,
  getCoupon,
  applyCoupon,
};
