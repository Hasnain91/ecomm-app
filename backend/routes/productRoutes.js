const express = require("express");
const upload = require("../middleware/multer");
const adminAuth = require("../middleware/adminAuth");

const {
  addProduct,
  listProducts,
  removeProduct,
  getProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
router.post("/remove", adminAuth, removeProduct);
router.get("/list", listProducts);
router.get("/single/:id", getProduct);

module.exports = router;
