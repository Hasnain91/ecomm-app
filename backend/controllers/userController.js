const User = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Authenticate --> Login user
const loginUser = async (req, res) => {};

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

// Admin Login
const adminLogin = async (req, res) => {
  res.send("Yu, Admin, Whats up");
};

module.exports = { loginUser, registerUser, adminLogin };
