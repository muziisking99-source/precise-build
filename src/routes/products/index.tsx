import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Effects";
import { CategoryExploreLink } from "../../components/CategoryExploreLink";
import { CategoryImageCarousel } from "../../components/CategoryImageCarousel";
import { categoryHeroesQueryOptions } from "@/lib/queries/options";

export const Route = createFileRoute("/products/")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(categoryHeroesQueryOptions()),
  head: () => ({
    meta: [
      { title: "Product Categories — Golden Fresh Biscuits" },
      { name: "description", content: "Explore Golden Fresh single packs and bulk biscuits — perfect for snacking or stocking up the whole family." },
    ],
  }),
  component: ProductCategories,
});

function ProductCategories() {
  const { data: carousel = { single: [], bulk: [] } } = useQuery(categoryHeroesQueryOptions());

  const Card = ({
    title, desc, to, images, ctaClass, ctaText, category,
  }: {
    title: string;
    desc: string;
    to: "/products/single" | "/products/bulk";
    images: string[];
    ctaClass: string;
    ctaText: string;
    category: "single" | "bulk";
  }) => (
    <Reveal className="category-card">
      <CategoryExploreLink
        to={to}
        category={category}
        title={title}
        image={images[0] ?? null}
        className="category-card-link"
      >
        <div className={`category-card-image ${images.length ? "" : "no-image"}`}>
          <CategoryImageCarousel images={images} alt={title} />
        </div>
        <div className="category-card-copy">
          <h3 className="category-card-title">{title}</h3>
          <p className="category-card-sub">{desc}</p>
        </div>
        <div className="category-card-body">
          <span className={`btn ${ctaClass} cat-card-btn`}>{ctaText} →</span>
        </div>
      </CategoryExploreLink>
    </Reveal>
  );

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
            <Card
              title="Single Biscuits"
              desc="Individually wrapped for freshness — perfect for on-the-go snacking, lunchboxes, and quick treats."
              to="/products/single"
              images={carousel.single}
              ctaClass="btn-red"
              ctaText="Explore Single Biscuits"
              category="single"
            />
            <Card
              title="Bulk Biscuits"
              desc="Family-size value packs for events, sharing, or stocking up — same Golden Fresh quality, bigger boxes."
              to="/products/bulk"
              images={carousel.bulk}
              ctaClass="btn-secondary"
              ctaText="Explore Bulk Biscuits"
              category="bulk"
            />
          </div>
        </div>
      </section>
    </>
  );
}
