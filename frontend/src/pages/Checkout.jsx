import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import api from "../api/axios.jsx";

const Checkout = () => {
  const navigate = useNavigate();

  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [orderId, setOrderId] = useState(null);

  // Check payment status every 3 seconds
  useEffect(() => {
    if (!orderId || status !== "waiting") return;

    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);

        if (data.isPaid) {
          clearInterval(interval);
          clearCart();
          navigate("/order-success");
        }
      } catch (error) {
        console.error(error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, status, clearCart, navigate]);

  const handlePayment = async () => {
    if (!phone.trim()) {
      setMessage("Please enter your M-Pesa number.");
      return;
    }

    if (!items.length) {
      setMessage("Your cart is empty.");
      return;
    }

    setLoading(true);
    setMessage("");
    setStatus("processing");

    try {
      const orderItems = items.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.quantity,
      }));

      // Create order
      const orderRes = await api.post("/orders", {
        orderItems,
        totalPrice: subtotal,
      });

      const order = orderRes.data;
      setOrderId(order._id);

      // Send STK Push
      const res = await fetch("http://localhost:5000/api/payments/stk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          phone,
          amount: subtotal,
          orderId: order._id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.ResponseCode === "0") {
        setStatus("waiting");
        setMessage(
          "STK request sent. Please check your phone and enter your M-Pesa PIN."
        );
      } else {
        setStatus("failed");
        setMessage(data.message || "Payment request failed.");
      }
    } catch (error) {
      console.error(error);
      setStatus("failed");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-lg mb-3">Order Summary</h2>

        {items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between py-2 border-b"
          >
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>KSh {item.price * item.quantity}</span>
          </div>
        ))}

        <div className="flex justify-between mt-4 font-bold text-lg">
          <span>Total</span>
          <span>KSh {subtotal}</span>
        </div>
      </div>

      <input
        type="text"
        placeholder="2547XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border rounded p-3 mb-4"
      />

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay with M-Pesa"}
      </button>

      {status === "waiting" && (
        <p className="mt-4 text-center text-blue-600 font-medium">
          Waiting for payment confirmation...
        </p>
      )}

      {message && (
        <p className="mt-4 text-center text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export default Checkout;