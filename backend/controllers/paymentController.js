import axios from "axios";
import Order from "../models/Order.js";

// ==========================
// INITIATE MPESA PAYMENT
// ==========================
export const initiatePayment = async (req, res) => {
  try {
    const { phone, amount, orderId } = req.body;

    if (!phone || !amount || !orderId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // Find the order created by Checkout
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Generate access token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenRes = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const token = tokenRes.data.access_token;

    // Timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);

    // Password
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    console.log("Callback URL:", process.env.MPESA_CALLBACK_URL);

    // Send STK Push
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: order._id.toString(),
        TransactionDesc: "Belletny Order Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("STK RESPONSE:", response.data);

    // Save CheckoutRequestID
    order.checkoutRequestId = response.data.CheckoutRequestID;
    await order.save();

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("STK ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Payment initiation failed",
    });
  }
};

// ==========================
// MPESA CALLBACK
// ==========================
export const paymentCallback = async (req, res) => {
  try {
    console.log(
      "CALLBACK RECEIVED:",
      JSON.stringify(req.body, null, 2)
    );

    const stkCallback = req.body?.Body?.stkCallback;

    if (!stkCallback) {
      return res.status(400).json({
        message: "Invalid callback payload",
      });
    }

    // Payment failed
    if (stkCallback.ResultCode !== 0) {
      console.log("Payment Failed:", stkCallback.ResultDesc);

      return res.json({
        status: "failed",
        message: stkCallback.ResultDesc,
      });
    }

    const metadata = stkCallback.CallbackMetadata?.Item || [];

    const getValue = (name) =>
      metadata.find((item) => item.Name === name)?.Value;

    const receipt = getValue("MpesaReceiptNumber");
    const phone = getValue("PhoneNumber");
    const amount = getValue("Amount");

    // Find the order using CheckoutRequestID
    const order = await Order.findOne({
      checkoutRequestId: stkCallback.CheckoutRequestID,
    });

    if (!order) {
      console.log("Order not found for:", stkCallback.CheckoutRequestID);

      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Update payment details
    order.isPaid = true;
    order.status = "Processing";
    order.paidAt = new Date();

    order.paymentResult = {
      receipt,
      phone,
      amount,
    };

    await order.save();

    console.log("Payment confirmed:", order._id);

    return res.json({
      status: "success",
    });
  } catch (error) {
    console.error("CALLBACK ERROR:", error);

    return res.status(500).json({
      message: "Callback processing failed",
    });
  }
};