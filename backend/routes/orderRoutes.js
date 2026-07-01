import express from "express";
import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ==========================
   CUSTOMER ROUTES
========================== */
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

/* ==========================
   ADMIN ROUTES
========================== */
router.get("/", protect, admin, getOrders);

// Delete an order completely
router.delete("/:id", protect, admin, cancelOrder);

// Update order status
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;