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
const listProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    let query = {};

    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
        ],
      };
    }

    let skip = (page - 1) * limit;

    if (skip < 0) skip = 0;

    const products = await Product.find(query).skip(skip).limit(Number(limit));

    const totalProducts = await Product.countDocuments(query);
    res.status(200).json({
      success: true,
      products,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.log("Error in listProducts controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// Remove Product
const removeProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.body.id);

    res
      .status(200)
      .json({ success: true, message: "Producted Deleted Successfully!!" });
  } catch (error) {
    console.log("Error in removeProduct controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// Get single Product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error in getProduct controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

module.exports = { addProduct, listProducts, removeProduct, getProduct };
