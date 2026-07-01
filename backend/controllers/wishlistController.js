import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }

  return wishlist;
};

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    await wishlist.populate("products");

    res.json(wishlist.products);
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const wishlist = await getOrCreateWishlist(req.user._id);
    const alreadySaved = wishlist.products.some(
      (productId) => productId.toString() === req.params.productId,
    );

    if (!alreadySaved) {
      wishlist.products.push(product._id);
      await wishlist.save();
    }

    await wishlist.populate("products");
    res.status(201).json(wishlist.products);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);

    wishlist.products = wishlist.products.filter(
      (productId) => productId.toString() !== req.params.productId,
    );

    await wishlist.save();
    await wishlist.populate("products");

    res.json(wishlist.products);
  } catch (error) {
    next(error);
  }
};
   


export const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);

    wishlist.products = [];
    await wishlist.save();

    res.json([]);
  } catch (error) {
    next(error);
  }
};