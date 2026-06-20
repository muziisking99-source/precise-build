import { createFileRoute } from "@tanstack/react-router";
import { ProductsBackLink } from "../../components/ProductsBackLink";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "../../components/PageHero";
import { Section } from "../../components/Section";
import { Reveal } from "../../components/Effects";
import { ProductMascotFallback } from "../../components/RangeMascot";
import { productTopStyle } from "../../lib/uiTint";
import { BULK_PRODUCTS } from "../../data/products";
import { ProductImageLightbox } from "../../components/ProductImageLightbox";
import { ProductsLoading } from "../../components/ProductsLoading";
import { bulkProductsQueryOptions } from "@/lib/queries/options";
import type { RangeCharacter } from "@/lib/rangeCharacter";

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

function bulkFallback(name: string) {
  const lower = name.toLowerCase();
  return (
    BULK_PRODUCTS.find((b) => b.name.toLowerCase() === lower) ??
    BULK_PRODUCTS.find((b) => lower.includes(b.name.toLowerCase()) || b.name.toLowerCase().includes(lower))
  );
}

function bulkMascot(name: string, fb: (typeof BULK_PRODUCTS)[number] | undefined): RangeCharacter | null {
  if (!fb?.Mascot) return null;
  return { name, range: "bulk", image_url: null, Comp: fb.Mascot };
}

function BulkProducts() {
  const { data: items, isPending } = useQuery(bulkProductsQueryOptions());
  const showLoading = isPending && items === undefined;

  const list = items && items.length
    ? items
    : items !== undefined
      ? BULK_PRODUCTS.map((p) => ({
          name: p.name,
          image_url: null as string | null,
          color: p.color,
          description: p.desc ?? null,
        }))
      : [];

  return (
    <>
      <PageHero
        eyebrow="Bulk Range"
        title={<>Our <span className="accent">Bulk Biscuit</span> Range</>}
        description="Great value packs for families, spaza shops, and events — the same Golden Fresh quality in every box."
      >
        <ProductsBackLink />
      </PageHero>

      {showLoading ? (
        <ProductsLoading variant="bulk" />
      ) : (
        <Section variant="cream">
          <div className="range-section">
            <div className="grid-3 bulk-product-grid">
              {list.map((p, idx) => {
                const fb = bulkFallback(p.name) ?? BULK_PRODUCTS[idx % BULK_PRODUCTS.length];
                const mascot = bulkMascot(p.name, fb);

                return (
                  <Reveal key={`${p.name}-${idx}`} className="prod-card">
                    <div
                      className={`prod-top prod-mascot prod-top--bulk${p.image_url ? " prod-top--pack" : ""}`}
                      style={p.image_url ? undefined : productTopStyle(p.color)}
                    >
                      {p.image_url ? (
                        <ProductImageLightbox src={p.image_url} alt={p.name} />
                      ) : (
                        <ProductMascotFallback mascot={mascot} color={p.color} name={p.name} />
                      )}
                    </div>
                    <div className="prod-body">
                      <div className="prod-name">{p.name}</div>
                      {p.description && <p className="prod-desc">{p.description}</p>}
                      <a className="prod-link" href="#">Find It →</a>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
