import { useEffect, useState } from "react";
import api from "../api/axios.jsx";
import Loader from "../components/common/Loader";
import formatCurrency from "../utils/formatCurrency.jsx";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return <Loader label="Loading your orders..." />;
  }

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            No orders yet
          </h2>

          <p className="text-gray-500">
            Your orders will appear here after you complete a purchase.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-5 shadow-sm"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-semibold">
                    Order ID
                  </p>
                  <p className="text-sm text-gray-500">
                    {order._id}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>

                    <span>
                      {formatCurrency(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-semibold mb-2">
                <span>Total</span>
                <span>
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Payment</span>

                <span
                  className={
                    order.isPaid
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Status</span>

                <span className="font-semibold">
                  {order.status || "Processing"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyOrders;