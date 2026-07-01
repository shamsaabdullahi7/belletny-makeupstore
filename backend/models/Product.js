import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 120,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      maxlength: 80,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Lipstick", "Foundation", "Eyeshadow", "Blush", "Skincare", "Tools"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    shade: {
      type: String,
      trim: true,
      default: "",
    },
    finish: {
      type: String,
      trim: true,
      default: "",
    },
    ingredients: {
      type: [String],
      default: [],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
  type: Number,
  default: 0,
    },
    numReviews: {
  type: Number,
  default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", brand: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
