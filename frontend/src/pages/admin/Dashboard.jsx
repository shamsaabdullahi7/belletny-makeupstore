import {
  Boxes,
  PackagePlus,
  ShoppingBag,
  Users,
  Wallet,
  ReceiptText,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.jsx";
import formatCurrency from "../../utils/formatCurrency.jsx";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, dashboardRes] = await Promise.all([
          api.get("/products"),
          api.get("/dashboard"),
        ]);

        setProducts(productsRes.data);
        setDashboard(dashboardRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const inventoryValue = products.reduce(
      (total, product) =>
        total + product.price * product.countInStock,
      0
    );

    const lowStock = products.filter(
      (product) => product.countInStock <= 5
    ).length;

    return [
      {
        label: "Products",
        value: dashboard.totalProducts,
        icon: ShoppingBag,
      },
      {
        label: "Inventory Value",
        value: formatCurrency(inventoryValue),
        icon: Boxes,
      },
      {
        label: "Low Stock",
        value: lowStock,
        icon: PackagePlus,
      },
      {
        label: "Total Customers",
        value: dashboard.totalCustomers,
        icon: Users,
      },
      {
        label: "Total Orders",
        value: dashboard.totalOrders,
        icon: ReceiptText,
      },
      {
        label: "Revenue",
        value: formatCurrency(dashboard.totalRevenue),
        icon: Wallet,
      },
    ];
  }, [products, dashboard]);

  if (loading) {
    return (
      <div className="page-shell py-12">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell py-12 text-red-500">
        {error}
      </div>
    );
  }

  return (

  <section className="page-shell py-12">
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div>
      <p className="eyebrow">Admin</p>
      <h1 className="section-title mt-3">Dashboard</h1>
    </div>

    <Link
      to="/admin/products/create"
      className="inline-flex min-h-11 items-center justify-center bg-rose px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-cream transition hover:bg-ink"
    >
      Create Product
    </Link>
  </div>

  {/* Statistics */}
  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {stats.map((stat) => (
      <div
        key={stat.label}
        className="border border-ink/10 bg-porcelain p-5"
      >
        <stat.icon className="text-rose" size={22} />

        <p className="mt-5 text-sm uppercase tracking-[0.18em] text-ink/55">
          {stat.label}
        </p>

        <p className="mt-2 font-display text-3xl">
          {stat.value}
        </p>
      </div>
    ))}
  </div>

  {/* Recent Orders */}
  <div className="mt-10 border border-ink/10 bg-porcelain p-5">
    <div className="flex items-center justify-between">
      <h2 className="font-display text-2xl">
        Recent Orders
      </h2>

      <Link
        to="/admin/orders"
        className="text-sm font-semibold uppercase tracking-[0.16em] text-rose"
      >
        View All
      </Link>
    </div>

    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-ink/10 text-xs uppercase tracking-[0.16em] text-ink/55">
          <tr>
            <th className="py-3">Customer</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {dashboard.recentOrders.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-5 text-center">
                No orders found.
              </td>
            </tr>
          ) : (
            dashboard.recentOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-ink/5"
              >
                <td className="py-4">
                  {order.user?.name || "Guest"}
                </td>

                <td>
                  {formatCurrency(order.totalPrice)}
                </td>

                <td>
                  {order.isPaid ? (
                    <span className="text-green-600 font-semibold">
                      Paid
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>

                <td>{order.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Recent Products */}
  <div className="mt-10 border border-ink/10 bg-porcelain p-5">
    <div className="flex items-center justify-between">
      <h2 className="font-display text-2xl">
        Recent Products
      </h2>

      <Link
        to="/admin/products"
        className="text-sm font-semibold uppercase tracking-[0.16em] text-rose"
      >
        Manage All
      </Link>
    </div>

    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="border-b border-ink/10 text-xs uppercase tracking-[0.16em] text-ink/55">
          <tr>
            <th className="py-3">Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.slice(0, 5).map((product) => (
            <tr
              key={product._id}
              className="border-b border-ink/5"
            >
              <td className="py-4">
                {product.name}
              </td>

              <td>{product.category}</td>

              <td>
                {formatCurrency(product.price)}
              </td>

              <td>{product.countInStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>
);
};

export default Dashboard;