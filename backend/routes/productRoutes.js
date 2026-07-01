import express from "express";
import multer from "multer";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { admin } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.route("/").get(getProducts).post(protect, admin, upload.array("images", 6), createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.array("images", 6), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
