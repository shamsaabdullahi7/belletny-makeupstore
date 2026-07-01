import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";

const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const uploadFile = async (file) => {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: process.env.CLOUDINARY_FOLDER || "belletny-products",
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

const productPayload = (body) => ({
  name: body.name,
  brand: body.brand,
  category: body.category,
  description: body.description,
  price: Number(body.price),
  countInStock: Number(body.countInStock),
  shade: body.shade || "",
  finish: body.finish || "",
  featured: body.featured === true || body.featured === "true",
  ingredients: parseList(body.ingredients),
});

const parseExistingImages = (value, fallback) => {
  if (!value) return fallback;

  try {
    const images = JSON.parse(value);
    if (!Array.isArray(images)) {
      throw new Error("existingImages must be an array");
    }

    return images.filter((image) => image?.url);
  } catch {
    const error = new Error("Invalid existingImages format");
    error.statusCode = 400;
    throw error;
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { search, category, brand, sort = "newest" } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      name: { name: 1 },
    };

    const products = await Product.find(query).sort(sortMap[sort] || sortMap.newest);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const images = req.files?.length
      ? await Promise.all(req.files.map((file) => uploadFile(file)))
      : [];

    const product = await Product.create({
      ...productPayload(req.body),
      images,
      user: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const uploadedImages = req.files?.length
      ? await Promise.all(req.files.map((file) => uploadFile(file)))
      : [];

    const retainedImages = parseExistingImages(req.body.existingImages, product.images);
    const retainedPublicIds = new Set(retainedImages.map((image) => image.publicId).filter(Boolean));
    const removedImages = product.images.filter(
      (image) => image.publicId && !retainedPublicIds.has(image.publicId),
    );

    await Promise.all(removedImages.map((image) => cloudinary.uploader.destroy(image.publicId)));

    Object.assign(product, {
      ...productPayload(req.body),
      images: [...retainedImages, ...uploadedImages],
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    await Promise.all(
      product.images
        .filter((image) => image.publicId)
        .map((image) => cloudinary.uploader.destroy(image.publicId)),
    );

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
