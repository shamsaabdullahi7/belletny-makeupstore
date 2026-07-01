import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.jsx";
import ProductForm from "./ProductForm";

const initialForm = {
  name: "",
  brand: "",
  category: "Lipstick",
  description: "",
  price: "",
  countInStock: "",
  shade: "",
  finish: "",
  ingredients: "",
  featured: false,
  images: [],
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "images") {
          Array.from(value).forEach((file) =>
            formData.append("images", file)
          );
        } else if (key === "ingredients") {
          formData.append(
            "ingredients",
            value.split(",").map((i) => i.trim())
          );
        } else {
          formData.append(
            key,
            key === "price" || key === "countInStock"
              ? Number(value)
              : value
          );
        }
      });

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell py-12">
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="section-title mt-3">Create product</h1>
      </div>

      {error && (
        <p className="mb-4 text-red-500 text-sm">{error}</p>
      )}

      <ProductForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        submitLabel="Create Product"
        loading={loading}
      />
    </section>
  );
};

export default CreateProduct;