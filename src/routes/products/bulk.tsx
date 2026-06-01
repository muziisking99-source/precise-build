import { createFileRoute, Link } from "@tanstack/react-router";
import { RedBand } from "../../components/Layout";
import { PageHero } from "../../components/PageHero";
import { Section } from "../../components/Section";
import { Reveal } from "../../components/Effects";
import { productTopStyle } from "../../lib/uiTint";
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
      <PageHero
        eyebrow="Bulk Range"
        title={<>Our <span className="accent">Bulk Biscuit</span> Range</>}
        description="Great value packs for families, spaza shops, and events — the same Golden Fresh quality in every box."
      >
        <Link to="/products" className="products-back">← All categories</Link>
      </PageHero>

      <Section variant="cream" className="bulk-section">
        <div className="bulk-grid">
          {BULK_PRODUCTS.map((p) => (
            <Reveal key={p.name} className="bulk-card">
              <div className="bulk-card-img" style={productTopStyle(p.color)}>
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
      </Section>

      <RedBand title="Want to stock Golden Fresh?" body="We partner with spaza shops, supermarkets, and wholesalers nationwide." cta="Become a Stockist" />
    </>
  );
}
