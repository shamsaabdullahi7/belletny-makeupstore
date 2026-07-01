import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import {protect} from "../middleware/authMiddleware.js";
import {admin} from "../middleware/adminMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: process.env.CLOUDINARY_FOLDER || "luxury-makeup",
      }
    );

    res.status(200).json({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;