const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  const token = req.headers.token;
  // Trim quotes if present
  if (token && token.startsWith('"') && token.endsWith('"')) {
    receivedToken = token.slice(1, -1); // Remove surrounding quotes
  }
  console.log("token received by the backend:", token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized, No Token -- Login Again!",
    });
  }
  console.log("Decoded token:", jwt.decode(token));

  try {
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded_token.id;
    next();
  } catch (error) {
    console.log("Error in authUser middleware: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

module.exports = authenticateUser;
