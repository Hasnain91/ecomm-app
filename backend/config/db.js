const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/e-commerce-store`
    );
    console.log(`Mongo DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MOngo DB Connection Error: `, error);
  }
};

module.exports = connectDB;
