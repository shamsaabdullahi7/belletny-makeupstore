import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.jsx";
import Loader from "../components/common/Loader";
import ProductFilter from "../components/product/ProductFilter";
import ProductGrid from "../components/product/ProductGrid";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    sort: "newest",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(
            ([, value]) => value !== "" && value !== null
          )
        );

        const { data } = await api.get("/products", { params });

        setProducts(data);
      } catch {
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))],
    [products]
  );

  return (
    <section className="page-shell py-12">
      <div className="mb-8">
        <p className="eyebrow">Shop</p>
        <h1 className="section-title mt-3">
          Makeup essentials
        </h1>
      </div>

      {/* FILTERS */}
      <ProductFilter
        filters={filters}
        brands={brands}
        onChange={setFilters}
      />

      {/* CONTENT */}
      <div className="mt-8">
        {loading ? (
          <Loader label="Loading products..." />
        ) : error ? (
          <div className="text-center text-rose">{error}</div>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-10">
            No products found
          </div>
        )}
      </div>
    </section>
  );
};

export default Shop;
