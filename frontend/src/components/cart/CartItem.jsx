import { Minus, Plus, Trash2 } from "lucide-react";
import useCart from "../../hooks/useCart";
import formatCurrency from "../../utils/formatCurrency.jsx";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="grid grid-cols-[88px_1fr] gap-4 border-b border-ink/10 py-5">
      <img src={item.image} alt={item.name} className="aspect-square w-full object-cover" />
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose">{item.brand}</p>
            <p className="mt-1 font-display text-lg leading-tight">{item.name}</p>
          </div>
          <button onClick={() => removeFromCart(item._id)} className="text-ink/45 transition hover:text-rose" aria-label="Remove item">
            <Trash2 size={18} />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-ink/15">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              className="flex h-9 w-9 items-center justify-center"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="flex h-9 min-w-9 items-center justify-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              className="flex h-9 w-9 items-center justify-center"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
