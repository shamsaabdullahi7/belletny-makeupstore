import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.jsx";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import formatCurrency from "../../utils/formatCurrency.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    setDeletingId(id);

    try {
      await api.delete(`/products/${id}`);

      // update UI instantly (no refetch needed)
      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Loader label="Loading inventory" />;
  }

  return (
    <section className="page-shell py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="section-title mt-3">Products</h1>
        </div>

        <Link to="/admin/products/create">
          <Button>
            <Plus size={17} />
            New Product
          </Button>
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}

      <div className="mt-8 overflow-x-auto border border-ink/10 bg-porcelain">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-[0.16em] text-ink/55">
            <tr>
              <th className="p-4">Product</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th className="text-right pr-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-ink/5"
              >
                <td className="p-4 font-medium">
                  {product.name}
                </td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>
                  {formatCurrency(product.price)}
                </td>
                <td>{product.countInStock}</td>

                <td className="pr-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="flex h-10 w-10 items-center justify-center border border-ink/10 hover:border-rose hover:text-rose"
                    >
                      <Edit size={17} />
                    </Link>

                    <button
                      onClick={() =>
                        removeProduct(product._id)
                      }
                      disabled={
                        deletingId === product._id
                      }
                      className="flex h-10 w-10 items-center justify-center border border-ink/10 hover:border-rose hover:text-rose disabled:opacity-40"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Products;