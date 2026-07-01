import { ImagePlus, Save } from "lucide-react";
import Button from "../../components/common/Button";

const categories = [
  "Lipstick",
  "Foundation",
  "Eyeshadow",
  "Blush",
  "Skincare",
  "Tools",
];

const ProductForm = ({
  form,
  setForm,
  onSubmit,
  submitLabel,
  loading = false,
  existingImages = [],
  setExistingImages,
}) => {
  if (!form) return null;

  const update = (event) => {
    const { name, value, type, checked, files } = event.target;

    if (type === "file") {
      setForm({
        ...form,
        images: Array.from(files), // FIXED
      });
      return;
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRemoveExisting = (url) => {
    if (!setExistingImages) return;
    setExistingImages(existingImages.filter((img) => img.url !== url));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 lg:grid-cols-[1fr_360px]"
    >
      {/* LEFT SIDE */}
      <div className="space-y-5 border border-ink/10 bg-porcelain p-5 sm:p-6">
        <label className="block">
          <span className="luxury-label">Product name</span>
          <input
            className="luxury-field mt-2"
            name="name"
            value={form.name || ""}
            onChange={update}
            required
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            <span className="luxury-label">Brand</span>
            <input
              className="luxury-field mt-2"
              name="brand"
              value={form.brand || ""}
              onChange={update}
              required
            />
          </label>

          <label>
            <span className="luxury-label">Category</span>
            <select
              className="luxury-field mt-2"
              name="category"
              value={form.category || "Lipstick"}
              onChange={update}
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="luxury-label">Description</span>
          <textarea
            className="luxury-field mt-2 min-h-36"
            name="description"
            value={form.description || ""}
            onChange={update}
            required
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            <span className="luxury-label">Price</span>
            <input
              className="luxury-field mt-2"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price || ""}
              onChange={update}
              required
            />
          </label>

          <label>
            <span className="luxury-label">Stock</span>
            <input
              className="luxury-field mt-2"
              name="countInStock"
              type="number"
              min="0"
              value={form.countInStock || ""}
              onChange={update}
              required
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            <span className="luxury-label">Shade</span>
            <input
              className="luxury-field mt-2"
              name="shade"
              value={form.shade || ""}
              onChange={update}
            />
          </label>

          <label>
            <span className="luxury-label">Finish</span>
            <input
              className="luxury-field mt-2"
              name="finish"
              value={form.finish || ""}
              onChange={update}
            />
          </label>
        </div>

        <label className="block">
          <span className="luxury-label">Ingredients</span>
          <input
            className="luxury-field mt-2"
            name="ingredients"
            value={form.ingredients || ""}
            onChange={update}
            placeholder="Rose oil, squalane, peptides"
          />
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            checked={!!form.featured}
            onChange={update}
            className="h-5 w-5 accent-rose"
          />
          <span className="text-sm font-semibold uppercase tracking-[0.16em]">
            Feature on storefront
          </span>
        </label>
      </div>

      {/* RIGHT SIDE */}
      <aside className="space-y-5">
        <div className="border border-ink/10 bg-porcelain p-5">
          <span className="luxury-label flex items-center gap-2">
            <ImagePlus size={15} />
            Product images
          </span>

          <input
            className="mt-4 w-full text-sm"
            type="file"
            multiple
            accept="image/*"
            onChange={update}
          />

          <p className="mt-3 text-xs leading-5 text-ink/55">
            Upload images (stored in Cloudinary on save)
          </p>
        </div>

        {/* EXISTING IMAGES */}
        {existingImages?.length > 0 && (
          <div className="border border-ink/10 bg-porcelain p-5">
            <p className="luxury-label">Existing images</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {existingImages.map((image) => (
                <div key={image.url} className="relative">
                  <img
                    src={image.url}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveExisting(image.url)
                    }
                    className="absolute right-2 top-2 bg-rose px-2 py-1 text-xs text-cream hover:bg-ink"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBMIT */}
        <Button
          className="w-full"
          type="submit"
          disabled={loading}
        >
          <Save size={17} />
          {loading ? "Saving..." : submitLabel}
        </Button>
      </aside>
    </form>
  );
};

export default ProductForm;