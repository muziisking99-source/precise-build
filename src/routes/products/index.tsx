import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Effects";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Product Categories — Golden Fresh Biscuits" },
      { name: "description", content: "Explore Golden Fresh single packs and bulk biscuits — perfect for snacking or stocking up the whole family." },
    ],
  }),
  component: ProductCategories,
});

function ProductCategories() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title={<>Product <span className="accent">Categories</span></>}
        description="Whether you're looking for a quick snack or stocking up for your family, we have the perfect biscuit options for every occasion."
      />

      <section className="section section-cream products-landing">
        <div className="container">
          <div className="cat-grid">
            <Reveal className="cat-card">
              <Link to="/products/single" className="cat-card-link">
                <div className="cat-card-visual cat-card-visual--single" aria-hidden />
                <div className="cat-card-body">
                  <h3 className="cat-card-title">Single Biscuits</h3>
                  <p className="cat-card-desc">
                    Individually wrapped for freshness and perfect for on-the-go snacking. Our single biscuits come in a variety of flavours to satisfy every taste.
                  </p>
                  <span className="btn btn-red cat-card-btn">Explore Single Biscuits →</span>
                </div>
              </Link>
            </Reveal>

            <Reveal className="cat-card">
              <Link to="/products/bulk" className="cat-card-link">
                <div className="cat-card-visual cat-card-visual--bulk" aria-hidden />
                <div className="cat-card-body">
                  <h3 className="cat-card-title">Bulk Biscuits</h3>
                  <p className="cat-card-desc">
                    Perfect for families, events, or simply stocking up. Our bulk biscuits offer great value while maintaining the same Golden Fresh quality.
                  </p>
                  <span className="btn btn-secondary cat-card-btn">Explore Bulk Biscuits →</span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
