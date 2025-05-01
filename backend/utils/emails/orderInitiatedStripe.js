const getOrderInitiatedEmailStripe = (address, items, totalAmount) => {
  const itemListHTML = items
    .map((item) => `<li>${item.name} (${item.size}) × ${item.quantity}</li>`)
    .join("");

  return {
    subject: "Order Initiated - Awaiting Payment",
    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Initiated - FOREVER Shop</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f7fc;
      }
      .container {
        max-width: 650px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #e0e0e0;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #2b2d42;
        font-size: 28px;
      }
      .content {
        color: #555555;
        line-height: 1.6;
      }
      .content p {
        font-size: 16px;
      }
      .order-summary {
        margin-top: 30px;
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
      }
      .order-summary h3 {
        font-size: 18px;
        color: #333333;
        margin-bottom: 10px;
      }
      .order-summary ul {
        list-style: none;
        padding-left: 0;
      }
      .order-summary li {
        font-size: 16px;
        margin-bottom: 8px;
      }
      .total-amount {
        font-size: 18px;
        font-weight: bold;
        color: #2b2d42;
        margin-top: 15px;
      }
      .cta-button {
        display: inline-block;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 20px;
        border-radius: 5px;
        font-weight: bold;
        margin-top: 20px;
      }
      .cta-button:hover {
        background-color: #0056b3;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #888888;
        text-align: center;
      }
      a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Thank You for Your Order!</h1>
      </div>
      <div class="content">
        <p>Hi ${address.firstName} ${address.lastName},</p>
  
        <p>We are excited to let you know that your order has been successfully placed! Your payment is currently being processed via <strong>Stripe</strong>.</p>
  
        <p><strong>Delivery Address:</strong><br/>
          ${address.street}, ${address.city}, ${address.state}, ${
      address.zipcode
    }, ${address.country}<br/>
          <strong>Phone:</strong> ${address.phone}
        </p>
  
        <p><strong>Payment Method:</strong> Stripe (Awaiting Payment)</p>
  
        <div class="order-summary">
          <h3>Order Summary:</h3>
          <ul>${itemListHTML}</ul>
          <p class="total-amount">Total Amount: $${totalAmount}</p>
        </div>
  
        <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:support@forever.com">support@forever.com</a>.</p>
  
        <p>Once your payment is successfully processed, we'll send you another email to confirm the status of your order. Thank you for shopping with us!</p>
  
        <a href="https://forever.com" class="cta-button">Visit Our Store</a>
  
        <p>Best regards,<br/>The FOREVER Shop Team</p>
      </div>
  
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} FOREVER Shop. All rights reserved.</p>
        <p>If you did not place this order, please contact our support immediately.</p>
      </div>
    </div>
  </body>
  </html>`,
  };
};

module.exports = getOrderInitiatedEmailStripe;
