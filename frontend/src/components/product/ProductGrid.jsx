import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="border border-ink/10 bg-porcelain p-10 text-center">
        <p className="font-display text-2xl">No products found</p>
        <p className="mt-2 text-sm text-ink/60">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
