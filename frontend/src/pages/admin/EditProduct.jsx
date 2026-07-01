import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.jsx";
import Loader from "../../components/common/Loader";
import ProductForm from "./ProductForm";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);

        setForm({
          name: data.name || "",
          brand: data.brand || "",
          category: data.category || "Lipstick",
          description: data.description || "",
          price: data.price || "",
          countInStock: data.countInStock || 0,
          shade: data.shade || "",
          finish: data.finish || "",
          ingredients: data.ingredients?.join(", ") || "",
          featured: Boolean(data.featured),
          images: [],
        });

        setExistingImages(data.images || []);
      } catch (err) {
        setFetchError("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "images") {
          Array.from(value).forEach((file) =>
            formData.append("images", file)
          );
        } else {
          formData.append(key, value);
        }
      });

      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      await api.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) {
    return (
      <div className="page-shell py-12 text-red-500">
        {fetchError}
      </div>
    );
  }

  if (!form) return <Loader label="Loading product" />;

  return (
    <section className="page-shell py-12">
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="section-title mt-3">Edit product</h1>
      </div>

      <ProductForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        loading={loading}
        existingImages={existingImages}
        setExistingImages={setExistingImages}
      />
    </section>
  );
};

export default EditProduct;