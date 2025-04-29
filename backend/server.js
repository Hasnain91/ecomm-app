// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const connectCloudinary = require("./config/cloudinary");
// const { initializeSocket } = require("./config/socket.js");
// const userRoutes = require("./routes/userRoutes.js");
// const productRoutes = require("./routes/productRoutes.js");
// const orderRoutes = require("./routes/orderRoutes.js");
// const newsletterRoute = require("./routes/mailRoutes.js");
// const couponRoutes = require("./routes/couponRoutes.js");
// const messageRoutes = require("./routes/messageRoutes.js");
// const webhookRoute = require("./utils/webhook.js");

// dotenv.config();

// // app config
// const app = express();
// const server = http.createServer(app);
// const port = process.env.PORT || 4000;
// connectDB();
// connectCloudinary();

// initializeSocket(server); // Initialize WebSocket

// // middlewares
// app.use(cors());

// // ✅ Use raw body only for Stripe webhook
// app.use(
//   "/api/order/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   webhookRoute
// );

// app.use(express.json());

// // API endpoints
// app.use("/api/user", userRoutes);
// app.use("/api/product", productRoutes);
// app.use("/api/order", orderRoutes);
// app.use("/api/mail", newsletterRoute);
// app.use("/api/coupon", couponRoutes);
// app.use("/api/messages", messageRoutes);

// app.get("/", (req, res) => {
//   res.send("API is working");
// });

// // start the server
// server.listen(port, () => {
//   console.log(`Server started running on port ${port}`);
// });

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
const messageRoutes = require("./routes/messageRoutes.js");
const webhookHandler = require("./utils/webhook.js");

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();
initializeSocket(server);

// ✅ Don't parse JSON globally before webhook!
app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

// Now use express.json() after webhook
app.use(cors());
app.use(express.json());

// register all other routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/mail", newsletterRoute);
app.use("/api/coupon", couponRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is working");
});

server.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});
