const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");

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

      console.log(`✅ Order ${orderId} marked as paid`);
    } catch (err) {
      console.error("❌ Failed to update order:", err.message);
      return res.status(500).send("Server error updating order");
    }
  }

  res.status(200).json({ received: true });
};
