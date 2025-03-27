const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const connectCloudinary = require("./config/cloudinary");
const { initializeSocket } = require("./config/socket.js");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const newsletterRoute = require("./routes/mailRoutes.js");
const couponRoutes = require("./routes/couponRoutes.js");

dotenv.config();

// app config
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

initializeSocket(server); // Initialize WebSocket

// middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/mail", newsletterRoute);
app.use("/api/coupon", couponRoutes);

app.get("/", (req, res) => {
  res.send("API is working");
});

// start the server
server.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});
