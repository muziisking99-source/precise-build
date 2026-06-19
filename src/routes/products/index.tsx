import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Effects";
import { CategoryExploreLink } from "../../components/CategoryExploreLink";
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
  const { data: hero = { single: null, bulk: null } } = useQuery(categoryHeroesQueryOptions());

  const Card = ({
    num, title, desc, to, image, ctaClass, ctaText, category,
  }: {
    num: string;
    title: string;
    desc: string;
    to: "/products/single" | "/products/bulk";
    image: string | null;
    ctaClass: string;
    ctaText: string;
    category: "single" | "bulk";
  }) => (
    <Reveal className="category-card">
      <CategoryExploreLink
        to={to}
        category={category}
        title={title}
        image={image}
        className="category-card-link"
      >
        <div className={`category-card-image ${image ? "" : "no-image"}`}>
          {image ? <img src={image} alt={title} /> : <span className="category-card-fallback" aria-hidden />}
        </div>
        <div className="category-card-copy">
          <span className="category-card-num">{num}</span>
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
              num="01 — Category"
              title="Single Biscuits"
              desc="Individually wrapped for freshness — perfect for on-the-go snacking, lunchboxes, and quick treats."
              to="/products/single"
              image={hero.single}
              ctaClass="btn-red"
              ctaText="Explore Single Biscuits"
              category="single"
            />
            <Card
              num="02 — Category"
              title="Bulk Biscuits"
              desc="Family-size value packs for events, sharing, or stocking up — same Golden Fresh quality, bigger boxes."
              to="/products/bulk"
              image={hero.bulk}
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
