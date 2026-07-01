import express from "express";
import {
  initiatePayment,
  paymentCallback,
} from "../controllers/paymentController.js";

const router = express.Router();

// TEST ROUTE
router.get("/callback", (req, res) => {
  res.send("Callback route is working");
});

router.post("/stk", initiatePayment);
router.post("/callback", paymentCallback);

export default router;