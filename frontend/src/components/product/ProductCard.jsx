import { Heart, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import formatCurrency from "../../utils/formatCurrency.jsx";
import Button from "../common/Button";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const image = product.images?.[0]?.url;
  const saved = isInWishlist(product._id);

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to add products to your wishlist.");
      navigate("/login");
      return;
    }

    await toggleWishlist(product._id);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please sign in to add products to your bag.");
      navigate("/login");
      return;
    }

    addToCart(product);
  };

  return (
    <article className="group bg-porcelain">
      <div className="relative overflow-hidden bg-champagne/40">
        <Link to={`/products/${product._id}`} className="block">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center border border-ink/10 bg-porcelain text-center text-ink transition duration-500 group-hover:border-rose">
              <span className="max-w-40 px-4 font-display text-2xl leading-tight">
                Cloudinary image pending
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center bg-cream text-ink shadow-sm transition hover:bg-rose hover:text-cream"
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose">
              {product.brand}
            </p>

            <Link
              to={`/products/${product._id}`}
              className="mt-2 block font-display text-xl leading-tight hover:text-rose"
            >
              {product.name}
            </Link>
          </div>

          <p className="text-sm font-semibold">
            {formatCurrency(product.price)}
          </p>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/60">
          {product.description}
        </p>

        <Button
          className="mt-5 w-full"
          variant="secondary"
          disabled={!product.countInStock}
          onClick={handleAddToCart}
        >
          <ShoppingBag size={16} />
          {product.countInStock ? "Add to Bag" : "Sold Out"}
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;