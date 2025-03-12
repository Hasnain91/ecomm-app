const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const connectCloudinary = require("./config/cloudinary");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const newsletterRoute = require("./routes/newsletterRoute.js");

dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/newsletter", newsletterRoute);

app.get("/", (req, res) => {
  res.send("API is working");
});

// start the server
app.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});
