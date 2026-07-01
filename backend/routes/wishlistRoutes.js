import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getWishlist);
router.route("/:productId").post(protect, addToWishlist).delete(protect, removeFromWishlist);
router.delete("/", protect, clearWishlist);

export default router;
