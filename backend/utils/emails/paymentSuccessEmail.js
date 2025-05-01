function paymentSuccessEmail(order) {
  return {
    subject: "Order Placed - Payment Processed",
    html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Confirmed - FOREVER Shop</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f7fc;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 650px;
        margin: 30px auto;
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
        font-size: 28px;
        color: #2b2d42;
      }
      .content {
        color: #555555;
        line-height: 1.6;
      }
      .content p {
        font-size: 16px;
      }
      .order-summary {
        margin-top: 25px;
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
        padding-left: 20px;
      }
      .order-summary li {
        font-size: 16px;
        margin-bottom: 6px;
      }
      .total-amount {
        font-size: 18px;
        font-weight: bold;
        margin-top: 10px;
        color: #2b2d42;
      }
      .cta-button {
        display: inline-block;
        margin-top: 25px;
        padding: 12px 20px;
        background-color: #28a745;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .cta-button:hover {
        background-color: #218838;
      }
      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #888888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Payment Successful!</h1>
      </div>
  
      <div class="content">
        <p>Hi ${order.address.firstName} ${order.address.lastName},</p>
  
        <p>We're happy to inform you that your payment has been successfully received and your order is now confirmed!</p>
  
        <p>Your order is being prepared and will be dispatched soon. We'll notify you as soon as it's out for delivery.</p>
  
        <p><strong>Delivery Address:</strong><br/>
          ${order.address.street}, ${order.address.city}, ${
      order.address.state
    } ${order.address.zipcode}, ${order.address.country}<br/>
          <strong>Phone:</strong> ${order.address.phone}
        </p>
  
        <div class="order-summary">
          <h3>Order Summary:</h3>
          <ul>
            ${order.items
              .map(
                (item) =>
                  `<li>${item.name} (${item.size}) × ${item.quantity}</li>`
              )
              .join("")}
          </ul>
          <p class="total-amount">Total Paid: $${order.amount}</p>
        </div>
  
        <p>If you have any questions or need assistance, don't hesitate to contact us at <a href="mailto:support@forever.com">support@forever.com</a>.</p>
  
        <a class="cta-button" href="https://forever.com">Track Your Order</a>
  
        <p>Thank you for shopping with FOREVER Shop!<br/>We appreciate your trust.</p>
      </div>
  
      <div class="footer">
        &copy; ${new Date().getFullYear()} FOREVER Shop. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `,
  };
}

module.exports = paymentSuccessEmail;
