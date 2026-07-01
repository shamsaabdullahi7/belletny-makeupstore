import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import formatCurrency from "../../utils/formatCurrency.jsx";
import Button from "../common/Button";
import CartItem from "./CartItem";

const CartDrawer = () => {
  const navigate = useNavigate();

  const {
    closeCart,
    isCartOpen,
    items,
    subtotal,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    if (!items || items.length === 0) return;

    closeCart();
    navigate("/checkout");
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isCartOpen
          ? "pointer-events-auto visible"
          : "pointer-events-none invisible"
      }`}
    >
      {/* Overlay */}
      <button
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/45 transition-opacity ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close cart overlay"
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 p-5">
          <div>
            <p className="eyebrow">Your Bag</p>
            <h2 className="font-display text-2xl">The Edit</h2>
          </div>

          <button
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items && items.length > 0 ? (
            items.map((item) => (
              <CartItem key={item._id} item={item} />
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-2xl">
                Your bag is empty
              </p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-ink/60">
                Add a signature shade or complexion essential to begin.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-ink/10 p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm uppercase tracking-[0.18em] text-ink/60">
              Subtotal
            </span>
            <span className="font-display text-2xl">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <Button
            className="w-full"
            disabled={!items || items.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </Button>

          {items && items.length > 0 && (
            <button
              onClick={clearCart}
              className="mt-4 w-full text-sm font-semibold uppercase tracking-[0.16em] text-ink/55 hover:text-rose"
            >
              Clear bag
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;