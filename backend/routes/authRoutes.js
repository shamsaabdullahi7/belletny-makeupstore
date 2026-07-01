import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getUsers,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// User Profile
router.get("/me", protect, getMe);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

// Password Reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Admin Routes
router.get("/users", protect, admin, getUsers);

export default router;