import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionTag, RedBand, GoldBand } from "../../components/Layout";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Effects";
import { productTopStyle } from "../../lib/uiTint";
import { SINGLE_RANGES } from "../../data/products";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/products/single")({
  head: () => ({
    meta: [
      { title: "Single Biscuits — Golden Fresh" },
      { name: "description", content: "Nine ranges. Every moment. Every South African family. Explore Glucose Energy, Just Ginger, Luv-A-Lot, Trio, All-Star, Joker, Marie, Cream Biscuits and Supa Dupa." },
    ],
  }),
  component: SingleProducts,
});

type DbProduct = { id: string; name: string; description: string | null; image_url: string | null; pill_text: string | null; is_visible: boolean; sort_order: number };
type DbRange = { id: string; slug: string; name: string; description: string | null; sort_order: number; products: DbProduct[] };

function SingleProducts() {
  const [filter, setFilter] = useState("all");
  const [ranges, setRanges] = useState<DbRange[] | null>(null);

  useEffect(() => {
    supabase
      .from("product_ranges")
      .select("id, slug, name, description, sort_order, products(*)")
      .order("sort_order")
      .then(({ data }) => {
        if (!data) return;
        const filtered = (data as DbRange[])
          .filter((r) => r.slug !== "bulk")
          .map((r) => ({ ...r, products: (r.products ?? []).filter((p) => p.is_visible).sort((a, b) => a.sort_order - b.sort_order) }))
          .filter((r) => r.products.length > 0);
        setRanges(filtered);
      });
  }, []);

  // Build view model: prefer DB if present, otherwise fallback to hardcoded SINGLE_RANGES
  const view = ranges && ranges.length
    ? ranges.map((r) => {
        const fb = SINGLE_RANGES.find((s) => s.key === r.slug || s.name === r.name);
        return {
          key: r.slug,
          name: r.name,
          desc: r.description ?? fb?.desc ?? "",
          Mascot: fb?.Mascot,
          color: fb?.products?.[0]?.color ?? "#FFF200",
          products: r.products.map((p) => ({
            name: p.name,
            desc: p.description ?? "",
            color: fb?.products?.[0]?.color ?? "#FFF200",
            image_url: p.image_url,
            pill: p.pill_text,
          })),
        };
      })
    : SINGLE_RANGES.map((r) => ({
        key: r.key, name: r.name, desc: r.desc, Mascot: r.Mascot,
        color: r.products[0]?.color ?? "#FFF200",
        products: r.products.map((p) => ({ name: p.name, desc: p.desc, color: p.color, image_url: null as string | null, pill: r.name })),
      }));

  const TABS = [{ key: "all", label: "All" }, ...view.map((r) => ({ key: r.key, label: r.name }))];
  const visible = filter === "all" ? view : view.filter((r) => r.key === filter);

  return (
    <>
      <PageHero
        eyebrow="Single Packs"
        title={<>Our <span className="accent">Full Range</span></>}
        description="Nine ranges. Every moment. Every South African family."
      >
        <Link to="/products" className="products-back">← All categories</Link>
      </PageHero>

      <div className="filter-tabs">
        {TABS.map((t) => (
          <button key={t.key} type="button" className={`filter-tab ${filter === t.key ? "active" : ""}`} onClick={() => setFilter(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {visible.map((r) => (
        <section key={r.key} className="range-section">
          <Reveal className="range-head">
            <div className="range-head-text">
              <SectionTag>Range</SectionTag>
              <h2>{r.name}</h2>
              <p>{r.desc}</p>
            </div>
            {r.Mascot && (() => {
              const Mascot = r.Mascot;
              return <div className="range-mascot"><Mascot size={140} /></div>;
            })()}
          </Reveal>
          <div className="grid-3">
            {r.products.map((p) => (
              <Reveal key={p.name} className="prod-card">
                <div className="prod-top prod-mascot" style={productTopStyle(p.color)}>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} style={{ maxWidth: "100%", maxHeight: 120, objectFit: "contain" }} />
                  ) : r.Mascot ? (() => {
                    const Mascot = r.Mascot!;
                    return <Mascot size={90} />;
                  })() : (
                    <span className="prod-initial" style={{ color: p.color, borderColor: p.color }}>
                      {p.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="prod-body">
                  <div className="prod-pill">{p.pill ?? r.name}</div>
                  <div className="prod-name">{p.name}</div>
                  <p className="prod-desc">{p.desc}</p>
                  <a className="prod-link" href="#">Find It →</a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <GoldBand title="Collect the Gang" body="Nine ranges. Five characters. One proudly South African brand." cta="Shop All Products" />
      <RedBand title="Want to stock Golden Fresh?" body="We partner with spaza shops, supermarkets, and wholesalers nationwide." cta="Become a Stockist" />
    </>
  );
}
