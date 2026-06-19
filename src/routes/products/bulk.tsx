import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "../../components/PageHero";
import { Section } from "../../components/Section";
import { Reveal } from "../../components/Effects";
import { productTopStyle } from "../../lib/uiTint";
import { BULK_PRODUCTS } from "../../data/products";
import { supabase } from "@/integrations/supabase/client";
import { ProductImageLightbox } from "../../components/ProductImageLightbox";

export const Route = createFileRoute("/products/bulk")({
  head: () => ({
    meta: [
      { title: "Bulk Biscuits — Golden Fresh" },
      { name: "description", content: "Stock up with Golden Fresh bulk biscuits — short bread, creams, choc chip, Just Ginger, Luv-a-lot and more." },
    ],
  }),
  component: BulkProducts,
});

type DbProduct = { id: string; name: string; image_url: string | null; is_visible: boolean; sort_order: number };

function BulkProducts() {
  const [items, setItems] = useState<{ name: string; image_url: string | null; color: string }[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data: r } = await supabase.from("product_ranges").select("id").eq("slug", "bulk").maybeSingle();
      if (!r) return;
      const { data: ps } = await supabase
        .from("products")
        .select("id, name, image_url, is_visible, sort_order")
        .eq("range_id", (r as { id: string }).id)
        .eq("is_visible", true)
        .order("sort_order");
      if (ps && ps.length) {
        setItems((ps as DbProduct[]).map((p, i) => {
          const fb = BULK_PRODUCTS[i % BULK_PRODUCTS.length];
          return { name: p.name, image_url: p.image_url, color: fb?.color ?? "#C59B6D" };
        }));
      }
    })();
  }, []);

  const list = items ?? BULK_PRODUCTS.map((p) => ({ name: p.name, image_url: null as string | null, color: p.color }));

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
    </>
  );
}
