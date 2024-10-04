require("dotenv").config(); // Load environment variables

const express = require("express");
const paypal = require("@paypal/checkout-server-sdk");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PayPal API credentials from environment variables
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Create a PayPal transaction
app.post("/create-paypal-transaction", async (req, res) => {
  const { amount } = req.body; // Extract the amount from the request body

  // PayPal order creation request
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD", // Ensure the correct currency code is used
          value: amount.toString(), // Amount should be passed as a string
        },
      },
    ],
  });

  try {
    // Execute the PayPal order creation
    const order = await client.execute(request);
    console.log("Order ID:", order.result.id);

    // Respond with the order ID in JSON format
    res.status(200).json({ orderID: order.result.id });
  } catch (err) {
    console.error("Error creating PayPal transaction:", err);

    // Return the error message as JSON response
    res.status(500).json({
      error: "Error creating PayPal transaction",
      details: err.message,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
