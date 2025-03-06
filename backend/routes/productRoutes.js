const express = require("express");
const upload = require("../middleware/multer");

const {
  addProduct,
  listProducts,
  removeProduct,
  getProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
router.post("/remove", removeProduct);
router.post("/single", getProduct);
router.get("/list", listProducts);

module.exports = router;
