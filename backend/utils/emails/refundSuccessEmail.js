// utils/emails/refundSuccessEmail.js

const refundSuccessEmail = ({ address, items, amount }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Refund Processed - FOREVER Shop</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f6f6f6; padding: 0; margin: 0; }
      .container { background: #fff; max-width: 600px; margin: 30px auto; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      h1 { color: #d9534f; }
      p { color: #555; font-size: 16px; }
      .order-summary { background: #f9f9f9; padding: 20px; border-radius: 6px; margin-top: 20px; }
      .order-summary ul { padding-left: 20px; }
      .order-summary li { margin-bottom: 6px; }
      .total { font-weight: bold; margin-top: 10px; }
      .footer { font-size: 12px; text-align: center; color: #888; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Your Refund Has Been Processed</h1>
      <p>Hi ${address.firstName} ${address.lastName},</p>
      <p>Your order has been successfully cancelled and a refund of <strong>$${amount}</strong> has been issued to your original payment method.</p>
      <p><strong>Delivery Address (for reference):</strong><br />
        ${address.street}, ${address.city}, ${address.state}, ${
    address.zipcode
  }, ${address.country}<br />
        <strong>Phone:</strong> ${address.phone}
      </p>
      <div class="order-summary">
        <h3>Order Summary:</h3>
        <ul>
          ${items
            .map(
              (item) =>
                `<li>${item.name} (${item.size}) × ${item.quantity}</li>`
            )
            .join("")}
        </ul>
        <p class="total">Refunded Total: $${amount}</p>
      </div>
      <p>If you have any questions, feel free to contact our support team at <a href="mailto:support@forever.com">support@forever.com</a>.</p>
      <p>Thank you for shopping with FOREVER Shop!</p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} FOREVER Shop. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = refundSuccessEmail;
