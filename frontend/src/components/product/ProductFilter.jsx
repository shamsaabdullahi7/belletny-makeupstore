import { SlidersHorizontal } from "lucide-react";

const categories = ["", "Lipstick", "Foundation", "Eyeshadow", "Blush", "Skincare", "Tools"];

const ProductFilter = ({ filters, brands = [], onChange }) => {
  const update = (event) => {
    onChange({ ...filters, [event.target.name]: event.target.value });
  };

  return (
    <div className="grid gap-3 border border-ink/10 bg-porcelain p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <label>
        <span className="luxury-label flex items-center gap-2">
          <SlidersHorizontal size={14} />
          Search
        </span>
        <input
          className="luxury-field mt-2"
          name="search"
          value={filters.search}
          onChange={update}
          placeholder="Velvet lipstick"
        />
      </label>
      <label>
        <span className="luxury-label">Category</span>
        <select className="luxury-field mt-2" name="category" value={filters.category} onChange={update}>
          {categories.map((category) => (
            <option key={category || "all"} value={category}>
              {category || "All categories"}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="luxury-label">Brand</span>
        <select className="luxury-field mt-2" name="brand" value={filters.brand} onChange={update}>
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="luxury-label">Sort</span>
        <select className="luxury-field mt-2" name="sort" value={filters.sort} onChange={update}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
          <option value="name">Name</option>
        </select>
      </label>
    </div>
  );
};

export default ProductFilter;
