const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");
const sendEmail = require("./sendEmail");

module.exports = async function webhookHandler(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Received raw body length:", req.body.length);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const paymentIntentId = session.payment_intent;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("❌ No orderId found in metadata");
      return res.status(400).send("No orderId in session metadata");
    }

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          payment: true,
          paymentIntentId,
        },
        { new: true }
      );

      if (!updatedOrder) {
        console.error("❌ Order not found or update failed");
        return res.status(404).send("Order not found");
      }

      await sendEmail({
        to: updatedOrder.address.email,
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
      <p>Hi ${updatedOrder.address.firstName} ${
          updatedOrder.address.lastName
        },</p>

      <p>We're happy to inform you that your payment has been successfully received and your order is now confirmed!</p>

      <p>Your order is being prepared and will be dispatched soon. We'll notify you as soon as it's out for delivery.</p>

      <p><strong>Delivery Address:</strong><br/>
        ${updatedOrder.address.street}, ${updatedOrder.address.city}, ${
          updatedOrder.address.state
        } ${updatedOrder.address.zipcode}, ${updatedOrder.address.country}<br/>
        <strong>Phone:</strong> ${updatedOrder.address.phone}
      </p>

      <div class="order-summary">
        <h3>Order Summary:</h3>
        <ul>
          ${updatedOrder.items
            .map(
              (item) =>
                `<li>${item.name} (${item.size}) × ${item.quantity}</li>`
            )
            .join("")}
        </ul>
        <p class="total-amount">Total Paid: $${updatedOrder.amount}</p>
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
      });

      console.log(`✅ Order ${orderId} marked as paid`);
    } catch (err) {
      console.error("❌ Failed to update order:", err.message);
      return res.status(500).send("Server error updating order");
    }
  }

  res.status(200).json({ received: true });
};
