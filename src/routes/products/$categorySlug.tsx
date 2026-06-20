import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type CSSProperties } from "react";
import { SectionTag } from "../../components/Layout";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Effects";
import { RangeMascot, ProductMascotFallback } from "../../components/RangeMascot";
import { productTopStyle } from "../../lib/uiTint";
import { productPackImageScale } from "@/lib/productPackImage";
import { characterForRange } from "@/lib/rangeCharacter";
import { ProductImageLightbox } from "../../components/ProductImageLightbox";
import { ProductsLoading } from "../../components/ProductsLoading";
import {
  categoryBySlugQueryOptions,
  categoryCatalogQueryOptions,
  rangeCharactersQueryOptions,
} from "@/lib/queries/options";

export const Route = createFileRoute("/products/$categorySlug")({
  loader: async ({ params, context: { queryClient } }) => {
    const category = await queryClient.fetchQuery(categoryBySlugQueryOptions(params.categorySlug));
    if (!category) throw notFound();
    await Promise.all([
      queryClient.fetchQuery(categoryCatalogQueryOptions(params.categorySlug)),
      queryClient.fetchQuery(rangeCharactersQueryOptions()),
    ]);
  },
  head: ({ params }) => ({
    meta: [{ title: `${params.categorySlug} — Golden Fresh` }],
  }),
  component: CategoryProducts,
});

function CategoryProducts() {
  const { categorySlug } = Route.useParams();
  const [filter, setFilter] = useState("all");
  const { data: category } = useQuery(categoryBySlugQueryOptions(categorySlug));
  const { data: ranges, isPending } = useQuery(categoryCatalogQueryOptions(categorySlug));
  const { data: characters = [] } = useQuery(rangeCharactersQueryOptions());

  const view = (ranges ?? []).map((r) => {
    const mascot = characterForRange(r.slug, r.name, characters);
    return {
      key: r.slug,
      name: r.name,
      desc: r.description ?? "",
      mascot,
      color: "#C59B6D",
      products: r.products.map((p) => ({
        name: p.name,
        desc: p.description ?? "",
        color: "#C59B6D",
        image_url: p.image_url,
      })),
    };
  });

  const tabs = [{ key: "all", label: "All" }, ...view.map((r) => ({ key: r.key, label: r.name }))];
  const visible = filter === "all" ? view : view.filter((r) => r.key === filter);

  if (!category) return null;

  return (
    <>
      <PageHero
        eyebrow={category.title}
        title={<>Our <span className="accent">{category.title}</span></>}
        description={category.description ?? ""}
      >
        <Link to="/products" className="products-back">← All categories</Link>
      </PageHero>

      {isPending ? (
        <ProductsLoading variant="single" />
      ) : visible.length === 0 ? (
        <div className="section section-cream">
          <div className="container" style={{ padding: "48px 0", color: "var(--mid)" }}>
            No products in this category yet.
          </div>
        </div>
      ) : (
        <>
          {tabs.length > 2 && (
            <div className="filter-tabs">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`filter-tab ${filter === t.key ? "active" : ""}`}
                  onClick={() => setFilter(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {visible.map((r) => {
            const packScale = productPackImageScale(r.key);
            return (
              <section key={r.key} className="range-section">
                <Reveal className="range-head">
                  <div className="range-head-text">
                    <SectionTag>Range</SectionTag>
                    <h2>{r.name}</h2>
                    {r.desc && <p>{r.desc}</p>}
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
                        {p.desc && <p className="prod-desc">{p.desc}</p>}
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
