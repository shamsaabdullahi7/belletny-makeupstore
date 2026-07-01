import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../api/axios.jsx";
import ProductCard from "../components/product/ProductCard";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();

  // If user is logged in, don't show Home
  if (isAuthenticated) {
    return <Navigate to="/shop" replace />;
  }

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");

        const featured = data.filter((p) => p.featured);

        setFeaturedProducts(
          featured.length ? featured.slice(0, 3) : data.slice(0, 3)
        );
      } catch {
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const heroImage = featuredProducts?.[0]?.images?.[0]?.url;

  return (
    <>
      <section className="bg-cream text-ink">
        <div className="page-shell grid min-h-[calc(100vh-5rem)] items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-2xl">
            <p className="eyebrow">Luxury Makeup</p>

            <h1 className="mt-5 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
              Belletny
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-ink/68">
              High-performance color, complexion, and skin-prep essentials composed
              with modern elegance.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-rose px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-cream transition hover:bg-ink"
              >
                Shop Collection <ArrowRight size={17} />
              </Link>

              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center border border-ink/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition hover:border-rose hover:text-rose"
              >
                Join Concierge
              </Link>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden">
            {heroImage ? (
              <img
                src={heroImage}
                alt={featuredProducts?.[0]?.name || "product"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-cream" />
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 text-cream">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.2em]">
                <Sparkles size={18} className="text-rose" />
                Matte color, satin skin, modern beauty
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 className="section-title mt-3">The signature edit</h2>
          </div>

          <Link
            to="/shop"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-rose"
          >
            View all products
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading products...</div>
        ) : featuredProducts.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-ink/10 bg-porcelain p-10 text-center">
            <p className="font-display text-2xl">No products available</p>
          </div>
        )}
      </section>
    </>
  );
};

export default Home;