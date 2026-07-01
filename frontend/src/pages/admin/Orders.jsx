import { useEffect, useState } from "react";
import api from "../../api/axios.jsx";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import formatCurrency from "../../utils/formatCurrency.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/orders");

      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      setActionLoading(id);

      await api.put(`/orders/${id}/status`, { status });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    } finally {
      setActionLoading(null);
    }
  };

  // Remove order
  const cancelOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this order?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(id);

      await api.delete(`/orders/${id}`);

      setOrders((prev) =>
        prev.filter((order) => order._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to remove order");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <Loader label="Loading Orders..." />;
  }

  return (
    <section className="page-shell py-12">
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="section-title mt-3">Customer Orders</h1>
      </div>

      <div className="overflow-x-auto border border-ink/10 bg-porcelain">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-[0.16em] text-ink/55">
            <tr>
              <th className="p-4">Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Products</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
              <th>Date</th>
              <th className="pr-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-6 text-center">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-ink/5"
                >
                  <td className="p-4">
                    {order.user?.name || "Guest"}
                  </td>

                  <td>{order.user?.email || "-"}</td>

                  <td>{order.paymentResult?.phone || "-"}</td>

                  <td>
                    {order.orderItems.map((item, index) => (
                      <div key={index}>
                        {item.name} × {item.qty}
                      </div>
                    ))}
                  </td>

                  <td>{formatCurrency(order.totalPrice)}</td>

                  <td>
                    {order.isPaid ? (
                      <span className="font-semibold text-green-600">
                        Paid
                      </span>
                    ) : (
                      <span className="font-semibold text-red-600">
                        Pending
                      </span>
                    )}
                  </td>

                  <td>
                    <span className="font-semibold">
                      {order.status}
                    </span>
                  </td>

                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="pr-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        className="rounded bg-yellow-500 px-2 py-1 text-white"
                        onClick={() =>
                          updateStatus(order._id, "Processing")
                        }
                        disabled={actionLoading === order._id}
                      >
                        Processing
                      </button>

                      <button
                        className="rounded bg-blue-600 px-2 py-1 text-white"
                        onClick={() =>
                          updateStatus(order._id, "Shipped")
                        }
                        disabled={actionLoading === order._id}
                      >
                        Shipped
                      </button>

                      <button
                        className="rounded bg-green-600 px-2 py-1 text-white"
                        onClick={() =>
                          updateStatus(order._id, "Delivered")
                        }
                        disabled={actionLoading === order._id}
                      >
                        Delivered
                      </button>

                      <Button
                        onClick={() => cancelOrder(order._id)}
                        disabled={actionLoading === order._id}
                      >
                        {actionLoading === order._id
                          ? "Removing..."
                          : "Remove"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Orders;