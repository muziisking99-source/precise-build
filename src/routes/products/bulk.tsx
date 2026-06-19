import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "../../components/PageHero";
import { Section } from "../../components/Section";
import { Reveal } from "../../components/Effects";
import { productTopStyle } from "../../lib/uiTint";
import { BULK_PRODUCTS } from "../../data/products";
import { ProductImageLightbox } from "../../components/ProductImageLightbox";
import { ProductsLoading } from "../../components/ProductsLoading";
import { bulkProductsQueryOptions } from "@/lib/queries/options";

export const Route = createFileRoute("/products/bulk")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(bulkProductsQueryOptions()),
  head: () => ({
    meta: [
      { title: "Bulk Biscuits — Golden Fresh" },
      { name: "description", content: "Stock up with Golden Fresh bulk biscuits — short bread, creams, choc chip, Just Ginger, Luv-a-lot and more." },
    ],
  }),
  component: BulkProducts,
});

function BulkProducts() {
  const { data: items, isPending } = useQuery(bulkProductsQueryOptions());

  const list = !isPending && items && items.length
    ? items
    : !isPending
      ? BULK_PRODUCTS.map((p) => ({ name: p.name, image_url: null as string | null, color: p.color }))
      : [];

  return (
    <>
      <PageHero
        eyebrow="Bulk Range"
        title={<>Our <span className="accent">Bulk Biscuit</span> Range</>}
        description="Great value packs for families, spaza shops, and events — the same Golden Fresh quality in every box."
      >
        <Link to="/products" className="products-back">← All categories</Link>
      </PageHero>

      {isPending ? (
        <ProductsLoading variant="bulk" />
      ) : (
      <Section variant="cream" className="bulk-section">
        <div className="bulk-grid">
          {list.map((p, idx) => {
            const fb = BULK_PRODUCTS[idx % BULK_PRODUCTS.length];
            return (
              <Reveal key={`${p.name}-${idx}`} className="bulk-card">
                <div className={`bulk-card-img${p.image_url ? " bulk-card-img--pack" : ""}`} style={p.image_url ? undefined : productTopStyle(p.color)}>
                  {p.image_url ? (
                    <ProductImageLightbox src={p.image_url} alt={p.name} />
                  ) : fb?.Mascot ? (() => {
                    const Mascot = fb.Mascot;
                    return <Mascot size={90} />;
                  })() : (
                    <span className="prod-initial" style={{ color: p.color, borderColor: p.color }}>
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="bulk-card-name">{p.name}</div>
              </Reveal>
            );
          })}
        </div>
      </Section>
      )}
    </>
  );
}
