import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Effects";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Product Categories — Golden Fresh Biscuits" },
      { name: "description", content: "Explore Golden Fresh single packs and bulk biscuits — perfect for snacking or stocking up the whole family." },
    ],
  }),
  component: ProductCategories,
});

type CatHero = { single: string | null; bulk: string | null };

function ProductCategories() {
  const [hero, setHero] = useState<CatHero>({ single: null, bulk: null });

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("image_url, product_ranges!inner(category)")
        .not("image_url", "is", null)
        .limit(50);
      const next: CatHero = { single: null, bulk: null };
      (data ?? []).forEach((r: any) => {
        const cat = r.product_ranges?.category;
        if (cat === "single" && !next.single) next.single = r.image_url;
        if (cat === "bulk" && !next.bulk) next.bulk = r.image_url;
      });
      setHero(next);
    })();
  }, []);

  const Card = ({
    num, title, desc, to, image, ctaClass, ctaText,
  }: { num: string; title: string; desc: string; to: string; image: string | null; ctaClass: string; ctaText: string }) => (
    <Reveal className="category-card">
      <Link to={to} className="category-card-link">
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
      </Link>
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
            />
            <Card
              num="02 — Category"
              title="Bulk Biscuits"
              desc="Family-size value packs for events, sharing, or stocking up — same Golden Fresh quality, bigger boxes."
              to="/products/bulk"
              image={hero.bulk}
              ctaClass="btn-secondary"
              ctaText="Explore Bulk Biscuits"
            />
          </div>
        </div>
      </section>
    </>
  );
}
