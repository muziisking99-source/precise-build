type SiteSectionLoadingProps = {
  variant: "ribbon" | "ranges" | "characters" | "testimonials" | "contact" | "footer-links" | "hero-copy";
};

export function SiteSectionLoading({ variant }: SiteSectionLoadingProps) {
  if (variant === "ribbon") {
    return (
      <div className="ribbon products-loading-ribbon" aria-busy="true" aria-hidden>
        <div className="products-loading-ribbon-track" />
      </div>
    );
  }

  if (variant === "ranges") {
    return (
      <div className="site-loading-ranges" aria-busy="true" aria-label="Loading ranges">
        <div className="products-loading-range-featured" />
        <div className="ranges-grid site-loading-range-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="products-loading-range-card" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "characters") {
    return (
      <div className="char-scroll site-loading-characters" aria-busy="true" aria-label="Loading characters">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="products-loading-char-card" />
        ))}
      </div>
    );
  }

  if (variant === "testimonials") {
    return (
      <div className="testi-grid site-loading-testimonials" aria-busy="true" aria-label="Loading testimonials">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`products-loading-testi-card${i === 0 ? " products-loading-testi-card--featured" : ""}`} />
        ))}
      </div>
    );
  }

  if (variant === "contact") {
    return (
      <div className="site-loading-contact" aria-busy="true" aria-label="Loading contact details">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="products-loading-line products-loading-line--contact" />
        ))}
      </div>
    );
  }

  if (variant === "footer-links") {
    return (
      <div className="site-loading-footer-links" aria-busy="true" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="products-loading-line products-loading-line--footer" />
        ))}
      </div>
    );
  }

  return (
    <div className="site-loading-hero-copy" aria-busy="true" aria-label="Loading hero">
      <div className="products-loading-line products-loading-line--badge" />
      <div className="products-loading-line products-loading-line--title" />
      <div className="products-loading-line products-loading-line--title-short" />
      <div className="products-loading-line products-loading-line--sub" />
    </div>
  );
}
