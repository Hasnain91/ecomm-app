const nodemailer = require("nodemailer");

// Nodemailer transporter configure
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required.  " });
  }

  try {
    const mailOptions = {
      from: `"FOREVER" <${process.env.EMAIL_USER}>`,
      to: email,
      subject:
        "🎉 Welcome to Our Newsletter! Enjoy 20% Off Your First Purchase!",
      html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Our Newsletter</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
              }
              .header {
                background-color: #ff4d4d;
                color: #ffffff;
                text-align: center;
                padding: 20px;
              }
              .content {
                padding: 20px;
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
              }
              .highlight {
                color: #ff4d4d;
                font-weight: bold;
              }
              .button {
                display: inline-block;
                background-color: #ff4d4d;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-size: 18px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                padding: 15px;
                background-color: #f9f9f9;
                font-size: 14px;
                color: #888888;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>🎉 Welcome to Our Newsletter!</h1>
                <p>Enjoy 20% Off Your First Purchase</p>
              </div>
              <div class="content">
                <p>Hi there,</p>
                <p>Thank you for subscribing to our newsletter! As a token of appreciation, we're excited to offer you a <span class="highlight">20% discount</span> on your first purchase.</p>
                <p>Use the code <strong>WELCOME20</strong> at checkout to redeem your discount.</p>
                <p>Hurry! This exclusive offer is valid for a limited time only.</p>
                <a href="https://forever.com/shop" class="button">Shop Now</a>
                <p>We’re thrilled to have you as part of our community and can’t wait to share exclusive deals, updates, and more with you!</p>
              </div>
              <div class="footer">
                <p>If you have any questions, feel free to contact us at <a href="mailto:support@your-website.com" style="color: #ff4d4d;">support@forever.com</a>.</p>
                <p>Copyright 2025 © FOREVER - All Rights Reserved</p>
              </div>
            </div>
          </body>
          </html>
        `,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Subscription Successful!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Internal Servor Error" });
  }
};

module.exports = { subscribeToNewsletter };
