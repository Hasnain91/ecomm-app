const cloudinary = require("cloudinary").v2;
const Product = require("../models/productModel");

// Add Product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (img) => img !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (image) => {
        let res = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
          folder: "products",
        });
        return res.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      bestSeller: bestSeller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(productData);

    const product = new Product(productData);

    await product.save();

    res
      .status(201)
      .json({ success: true, message: "Product Added Successfully!!" });
  } catch (error) {
    console.log("Error in addProduct controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// get all Products
const listProducts = async (req, res) => {};

// Remove Product
const removeProduct = async (req, res) => {};

// Get single Product
const getProduct = async (req, res) => {};

module.exports = { addProduct, listProducts, removeProduct, getProduct };
