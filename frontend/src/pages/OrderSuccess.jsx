import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-6">
      <div className="w-full max-w-xl rounded-xl border border-green-200 bg-white p-10 text-center shadow-lg">
        <CheckCircle
          size={80}
          className="mx-auto mb-6 text-green-600"
        />

        <h1 className="text-3xl font-bold text-ink mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you for shopping with <strong>Belletny</strong>.
          <br />
          Your payment has been received successfully and your order is now
          being processed.
        </p>

        <div className="space-y-4">
          <Link
            to="/shop"
            className="block w-full rounded-lg bg-rose px-6 py-3 text-center font-semibold text-white transition hover:bg-rose-700"
          >
            Continue Shopping
          </Link>

          <Link
            to="/account"
            className="block w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;