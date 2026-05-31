import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionTag, RedBand } from "../../components/Layout";
import { Reveal } from "../../components/Effects";
import { BULK_PRODUCTS } from "../../data/products";

export const Route = createFileRoute("/products/bulk")({
  head: () => ({
    meta: [
      { title: "Bulk Biscuits — Golden Fresh" },
      { name: "description", content: "Stock up with Golden Fresh bulk biscuits — short bread, creams, choc chip, Just Ginger, Luv-a-lot and more." },
    ],
  }),
  component: BulkProducts,
});

function BulkProducts() {
  return (
    <>
      <section className="section section-cream bulk-section">
        <Link to="/products" className="products-back products-back--light">← All categories</Link>
        <Reveal className="section-head">
          <SectionTag>Bulk Range</SectionTag>
          <h2>
            Our <span className="accent">Bulk Biscuit</span> Range
          </h2>
          <p className="section-sub">
            Great value packs for families, spaza shops, and events — the same Golden Fresh quality in every box.
          </p>
        </Reveal>

        <div className="bulk-grid">
          {BULK_PRODUCTS.map((p) => (
            <Reveal key={p.name} className="bulk-card">
              <div className="bulk-card-img" style={{ background: `linear-gradient(135deg, ${p.color}18, ${p.color}44)` }}>
                {p.Mascot ? (() => {
                  const Mascot = p.Mascot;
                  return <Mascot size={90} />;
                })() : (
                  <span className="prod-initial" style={{ color: p.color, borderColor: p.color }}>
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="bulk-card-name">{p.name}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <RedBand title="Want to stock Golden Fresh?" body="We partner with spaza shops, supermarkets, and wholesalers nationwide." cta="Become a Stockist" />
    </>
  );
}
