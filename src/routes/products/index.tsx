import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Effects";
import { CategoryExploreLink } from "../../components/CategoryExploreLink";
import { CategoryImageCarousel } from "../../components/CategoryImageCarousel";
import { categoryHeroesQueryOptions, productCategoriesQueryOptions } from "@/lib/queries/options";

export const Route = createFileRoute("/products/")({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.fetchQuery(productCategoriesQueryOptions()),
      queryClient.fetchQuery(categoryHeroesQueryOptions()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Product Categories — Golden Fresh Biscuits" },
      { name: "description", content: "Explore Golden Fresh single packs and bulk biscuits — perfect for snacking or stocking up the whole family." },
    ],
  }),
  component: ProductCategories,
});

function ProductCategories() {
  const { data: categories = [] } = useQuery(productCategoriesQueryOptions());
  const { data: carousel = {} } = useQuery(categoryHeroesQueryOptions());

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title={<>Product <span className="accent">Categories</span></>}
        description="Whether you're looking for a quick snack or stocking up for your family, we have the perfect biscuit options for every occasion."
      />

      <section className="section section-cream products-landing">
        <div className="container">
          <div className="cat-grid category-grid">
            {categories.map((cat) => {
              const images = carousel[cat.slug] ?? [];
              const ctaClass = cat.cta_variant === "secondary" ? "btn-secondary" : "btn-red";
              const ctaText = cat.cta_text ?? `Explore ${cat.title}`;

              return (
                <Reveal key={cat.id} className="category-card">
                  <CategoryExploreLink
                    to={cat.route_path}
                    category={cat.slug}
                    title={cat.title}
                    image={images[0] ?? null}
                    className="category-card-link"
                  >
                    <div className={`category-card-image ${images.length ? "" : "no-image"}`}>
                      <CategoryImageCarousel images={images} alt={cat.title} />
                    </div>
                    <div className="category-card-copy">
                      <h3 className="category-card-title">{cat.title}</h3>
                      {cat.description && <p className="category-card-sub">{cat.description}</p>}
                    </div>
                    <div className="category-card-body">
                      <span className={`btn ${ctaClass} cat-card-btn`}>{ctaText} →</span>
                    </div>
                  </CategoryExploreLink>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
