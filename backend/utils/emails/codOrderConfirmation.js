function codOrderConfirmationEmail({ address, items, amount }) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Order Confirmation - FOREVER Shop</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f6f6f6;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      .header {
        text-align: center;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 20px;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #333333;
      }
      .content p {
        line-height: 1.6;
        color: #555555;
      }
      .order-details {
        margin-top: 20px;
      }
      .order-details ul {
        padding-left: 20px;
      }
      .order-details li {
        margin-bottom: 8px;
      }
      .total {
        font-size: 18px;
        font-weight: bold;
        margin-top: 10px;
      }
      .footer {
        margin-top: 30px;
        font-size: 14px;
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
  
        <p>We're excited to let you know that we've received your order and it's being processed.</p>
  
        <p><strong>Delivery Address:</strong><br/>
          ${address.street},<br/>
          ${address.city}, ${address.state} ${address.zipcode},<br/>
          ${address.country}<br/>
          <strong>Phone:</strong> ${address.phone}
        </p>
  
        <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
  
        <div class="order-details">
          <h3>Order Summary:</h3>
          <ul>
            ${items
              .map(
                (item) =>
                  `<li>${item.name} (${item.size}) × ${item.quantity}</li>`
              )
              .join("")}
          </ul>
          <p class="total">Total Amount: $${amount}</p>
        </div>
  
        <p>If you have any questions, reach out to our support team at 
          <a href="mailto:support@forever.com">support@forever.com</a>.
        </p>
  
        <p>Thank you for shopping with us!<br/>
        — The FOREVER Shop Team</p>
      </div>
  
      <div class="footer">
        &copy; ${new Date().getFullYear()} FOREVER Shop. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}

module.exports = codOrderConfirmationEmail;
