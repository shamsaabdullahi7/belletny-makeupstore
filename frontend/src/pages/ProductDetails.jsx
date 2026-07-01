import { Heart, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.jsx";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import formatCurrency from "../utils/formatCurrency.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader label="Preparing detail" />;

  if (!product) {
    return (
      <section className="page-shell py-16 text-center">
        <p className="font-display text-3xl">Product not found</p>

        <Link
          to="/shop"
          className="mt-5 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-rose"
        >
          Back to shop
        </Link>
      </section>
    );
  }

  const image = product.images?.[0]?.url;
  const saved = isInWishlist(product._id);

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to save products to your wishlist.");
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
    <section className="page-shell grid gap-10 py-12 lg:grid-cols-2">
      <div className="bg-champagne/40">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center border border-ink/10 bg-porcelain text-center text-ink">
            <span className="max-w-xs px-6 font-display text-3xl">
              Cloudinary image pending
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <Link
          to="/shop"
          className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-rose"
        >
          Back to shop
        </Link>

        <p className="eyebrow">{product.brand}</p>

        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
          {product.name}
        </h1>

        <p className="mt-5 font-display text-3xl">
          {formatCurrency(product.price)}
        </p>

        <p className="mt-6 max-w-xl text-base leading-8 text-ink/65">
          {product.description}
        </p>

        <div className="mt-8 grid gap-4 border-y border-ink/10 py-6 sm:grid-cols-3">
          <div>
            <p className="luxury-label">Shade</p>
            <p className="mt-2 text-sm">{product.shade || "Universal"}</p>
          </div>

          <div>
            <p className="luxury-label">Finish</p>
            <p className="mt-2 text-sm">{product.finish || "Natural"}</p>
          </div>

          <div>
            <p className="luxury-label">Stock</p>
            <p className="mt-2 text-sm">
              {product.countInStock} available
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            disabled={!product.countInStock}
            onClick={handleAddToCart}
          >
            <ShoppingBag size={17} />
            Add to Bag
          </Button>

          <Button
            className="w-full sm:w-auto"
            variant="secondary"
            onClick={handleWishlist}
          >
            <Heart
              size={17}
              fill={saved ? "currentColor" : "none"}
            />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;