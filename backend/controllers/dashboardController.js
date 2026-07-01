import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalCustomers = await User.countDocuments({
      isAdmin: false,
    });

    const paidOrders = await Order.find({ isPaid: true });

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};