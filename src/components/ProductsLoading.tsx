type ProductsLoadingProps = {
  variant: "single" | "bulk";
};

export function ProductsLoading({ variant }: ProductsLoadingProps) {
  if (variant === "bulk") {
    return (
      <div className="section section-cream" aria-busy="true" aria-label="Loading products">
        <div className="range-section">
          <div className="grid-3 bulk-product-grid products-loading-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="products-loading-card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-loading-single" aria-busy="true" aria-label="Loading products">
      <div className="filter-tabs products-loading-tabs">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="products-loading-tab" />
        ))}
      </div>
      <div className="range-section">
        <div className="products-loading-range-head" />
        <div className="grid-3 products-loading-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="products-loading-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
