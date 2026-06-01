import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SectionTag, RedBand, GoldBand } from "../../components/Layout";
import { PageHero } from "../../components/PageHero";
import { Reveal } from "../../components/Effects";
import { productTopStyle } from "../../lib/uiTint";
import { SINGLE_RANGES } from "../../data/products";

export const Route = createFileRoute("/products/single")({
  head: () => ({
    meta: [
      { title: "Single Biscuits — Golden Fresh" },
      { name: "description", content: "Nine ranges. Every moment. Every South African family. Explore Glucose Energy, Just Ginger, Luv-A-Lot, Trio, All-Star, Joker, Marie, Cream Biscuits and Supa Dupa." },
    ],
  }),
  component: SingleProducts,
});

const TABS = [{ key: "all", label: "All" }, ...SINGLE_RANGES.map((r) => ({ key: r.key, label: r.name }))];

function SingleProducts() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? SINGLE_RANGES : SINGLE_RANGES.filter((r) => r.key === filter);

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
                  {r.Mascot ? (() => {
                    const Mascot = r.Mascot;
                    return <Mascot size={90} />;
                  })() : (
                    <span className="prod-initial" style={{ color: p.color, borderColor: p.color }}>
                      {p.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="prod-body">
                  <div className="prod-pill">{r.name}</div>
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
