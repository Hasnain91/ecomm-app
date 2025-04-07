const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { getIo } = require("../config/socket"); // Import the socket instance
const { updateOrderStatus } = require("../../admin/src/api/endpoints");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1w" });
};

// Registrations --> Sign Up user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if a field is missing
    if (!name || !email || !password) {
      return res
        .status(200)
        .json({ success: false, message: "All fields are compulsory." });
    }

    //check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(200)
        .json({ success: false, message: "User already exists!" });
    }

    // check email format(Validity)
    if (!validator.isEmail(email)) {
      return res
        .status(200)
        .json({ success: false, message: "Please enter a valid email" });
    }
    // Strong password
    if (password.length < 6) {
      return res
        .status(200)
        .json({ success: false, message: "Password must be 6 characters" });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = generateToken(user._id);

    res.status(201).json({ success: true, name: user.name, token });
  } catch (error) {
    console.log("Error in registerUser controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// Authenticate --> Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email AND pasword." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    //Check user status
    if (user.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message:
          "Your account is blocked, please contact admin for further details.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        userId: user.id,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log("Error in loginUser Controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(" -password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Error in getUsers Controller: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Update User Status
const updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    // Validate input
    if (!userId || !status) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found!" });
    }

    user.status = status;
    await user.save();

    const io = getIo();
    if (!io) {
      console.error("Socket.io instance is undefined!");
      return res.status(500).json({ success: false, message: "Server Error" });
    }

    console.log("Emitting forceLogout to:", userId);
    io.to(userId).emit("forceLogout", {
      message: "Your account status has changed. Please log in again.",
    });

    res.status(200).json({ success: true, message: "User Status Updated!" });
  } catch (error) {
    console.log("Error in updateUserStatus Controller: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        sucess: false,
        message: "Please provide both Email AND Password",
      });
    }

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.status(200).json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log("Error in adminLogin Controller: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  adminLogin,
  getUsers,
  updateUserStatus,
};
