import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import formatCurrency from "../utils/formatCurrency.jsx";

const Wishlist = () => {
  const { addToCart } = useCart();
  const { items, loading, removeFromWishlist } = useWishlist();

  if (loading) return <Loader label="Loading wishlist" />;

  return (
    <section className="page-shell py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Wishlist</p>
          <h1 className="section-title mt-3">Saved essentials</h1>
        </div>
        <Link to="/shop" className="text-sm font-semibold uppercase tracking-[0.18em] text-rose">
          Continue shopping
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => {
            const image = product.images?.[0]?.url;

            return (
              <article key={product._id} className="bg-porcelain">
                <Link to={`/products/${product._id}`} className="block overflow-hidden bg-champagne/40">
                  {image ? (
                    <img src={image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[4/5] w-full items-center justify-center border border-ink/10 bg-porcelain text-center text-ink">
                      <span className="max-w-40 px-4 font-display text-2xl leading-tight">Cloudinary image pending</span>
                    </div>
                  )}
                </Link>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose">{product.brand}</p>
                      <Link to={`/products/${product._id}`} className="mt-2 block font-display text-xl leading-tight hover:text-rose">
                        {product.name}
                      </Link>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="mt-5 grid gap-3">
                    <Button disabled={!product.countInStock} onClick={() => addToCart(product)}>
                      <ShoppingBag size={16} />
                      {product.countInStock ? "Add to Bag" : "Sold Out"}
                    </Button>
                    <Button variant="secondary" onClick={() => removeFromWishlist(product._id)}>
                      <Heart size={16} fill="currentColor" />
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border border-ink/10 bg-porcelain p-10 text-center">
          <Heart className="mx-auto text-rose" size={28} />
          <p className="mt-4 font-display text-2xl">Your wishlist is empty</p>
          <Link to="/shop" className="mt-5 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-rose">
            Find products to save
          </Link>
        </div>
      )}
    </section>
  );
};

export default Wishlist;
