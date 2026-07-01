import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    next(new Error("Not authorized, token missing"));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      next(new Error("Not authorized, user not found"));
      return;
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
  console.error(error);
}

    res.status(401);
    next(new Error("Not authorized, token failed"));
  }
};
