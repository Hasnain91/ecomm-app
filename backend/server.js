const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const connectCloudinary = require("./config/cloudinary");

dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary;

// middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.get("/", (req, res) => {
  res.send("API is working");
});

// start the server
app.listen(port, () => {
  console.log(`Server started running on port ${port}`);
});
