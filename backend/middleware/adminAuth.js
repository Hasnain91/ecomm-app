const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized - No Token" });
    }

    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      token_decoded !==
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized - Wrong Token" });
    }
    next();
  } catch (error) {
    console.log("Error in adminAuth middleware: ", error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

module.exports = adminAuth;
