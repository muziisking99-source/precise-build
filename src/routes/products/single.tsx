import { createFileRoute } from '@tanstack/react-router'
import { ProductsBackLink } from "../../components/ProductsBackLink";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type CSSProperties } from "react";
import { SectionTag } from "../../components/Layout";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Effects";
import { RangeMascot, ProductMascotFallback } from "../../components/RangeMascot";
import { productTopStyle } from "../../lib/uiTint";
import { SINGLE_RANGES } from "../../data/products";
import { productPackImageScale } from "@/lib/productPackImage";
import { characterForRange } from "@/lib/rangeCharacter";
import { ProductImageLightbox } from "../../components/ProductImageLightbox";
import { ProductsLoading } from "../../components/ProductsLoading";
import {
  rangeCharactersQueryOptions,
  singleCatalogQueryOptions,
} from "@/lib/queries/options";

export const Route = createFileRoute("/products/single")({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(singleCatalogQueryOptions()),
      queryClient.ensureQueryData(rangeCharactersQueryOptions()),
    ]);
  },
  validateSearch: (search: Record<string, unknown>) => ({
    range: typeof search.range === "string" ? search.range : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Single Biscuits — Golden Fresh" },
      { name: "description", content: "Nine ranges. Every moment. Every South African family. Explore Glucose Energy, Just Ginger, Luv-A-Lot, Trio, All-Star, Joker, Marie, Cream Biscuits and Supa Dupa." },
    ],
  }),
  component: SingleProducts,
});

function SingleProducts() {
  const { range: rangeFromUrl } = Route.useSearch();
  const [filter, setFilter] = useState("all");
  const { data: ranges, isPending } = useQuery(singleCatalogQueryOptions());
  const { data: characters = [] } = useQuery(rangeCharactersQueryOptions());
  const showLoading = isPending && ranges === undefined;

  useEffect(() => {
    if (rangeFromUrl) setFilter(rangeFromUrl);
  }, [rangeFromUrl]);

  const view = ranges && ranges.length
    ? ranges.map((r) => {
        const fb = SINGLE_RANGES.find((s) => s.key === r.slug || s.name === r.name);
        const mascot = characterForRange(r.slug, r.name, characters);
        return {
          key: r.slug,
          name: r.name,
          desc: r.description ?? fb?.desc ?? "",
          mascot,
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
    : ranges !== undefined
      ? SINGLE_RANGES.map((r) => ({
          key: r.key, name: r.name, desc: r.desc, mascot: characterForRange(r.key, r.name, characters),
          color: r.products[0]?.color ?? "#FFF200",
          products: r.products.map((p) => ({ name: p.name, desc: p.desc, color: p.color, image_url: null as string | null, pill: r.name })),
        }))
      : [];

  const TABS = [{ key: "all", label: "All" }, ...view.map((r) => ({ key: r.key, label: r.name }))];
  const visible = filter === "all" ? view : view.filter((r) => r.key === filter);

  return (
    <>
      <PageHero
        eyebrow="Single Packs"
        title={<>Our <span className="accent">Full Range</span></>}
        description="Nine ranges. Every moment. Every South African family."
      >
        <ProductsBackLink />
      </PageHero>

      {showLoading ? (
        <ProductsLoading variant="single" />
      ) : (
        <>
      <div className="filter-tabs">
        {TABS.map((t) => (
          <button key={t.key} type="button" className={`filter-tab ${filter === t.key ? "active" : ""}`} onClick={() => setFilter(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {visible.map((r) => {
        const packScale = productPackImageScale(r.key);
        return (
        <section key={r.key} className="range-section">
          <Reveal className="range-head">
            <div className="range-head-text">
              <SectionTag>Range</SectionTag>
              <h2>{r.name}</h2>
              <p>{r.desc}</p>
            </div>
            <RangeMascot slug={r.key} mascot={r.mascot} />
          </Reveal>
          <div className="grid-3">
            {r.products.map((p) => (
              <Reveal key={p.name} className="prod-card">
                <div
                  className={`prod-top prod-mascot${p.image_url ? " prod-top--pack" : ""}${packScale > 1 ? " prod-top--pack-zoom" : ""}`}
                  style={
                    p.image_url
                      ? packScale > 1
                        ? ({ "--pack-scale": packScale } as CSSProperties)
                        : undefined
                      : productTopStyle(p.color)
                  }
                >
                  {p.image_url ? (
                    <ProductImageLightbox src={p.image_url} alt={p.name} />
                  ) : (
                    <ProductMascotFallback mascot={r.mascot} color={p.color} name={p.name} />
                  )}
                </div>
                <div className="prod-body">
                  <div className="prod-name">{p.name}</div>
                  <p className="prod-desc">{p.desc}</p>
                  <a className="prod-link" href="#">Find It →</a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
        );
      })}
        </>
      )}

    </>
  );
}
