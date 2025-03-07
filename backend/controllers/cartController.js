const User = require("../models/userModel");

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, size } = req.body;

    const userData = await User.findById(userId);

    let cartData = await userData.cartData;

    if (cartData[productId]) {
      if (cartData[productId][size]) {
        cartData[productId][size] += 1;
      } else {
        cartData[productId][size] = 1;
      }
    } else {
      cartData[productId] = {};
      cartData[productId][size] = 1;
    }

    await User.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log("Error in addToCart controller: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update products in user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await User.findById(userId);

    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    await User.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log("Error in updateCart controller: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get User Cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.findById(userId);

    let cartData = await userData.cartData;

    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log("Error in getUserCart controller: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { addToCart, updateCart, getUserCart };
