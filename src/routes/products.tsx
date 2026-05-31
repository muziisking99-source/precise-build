import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionTag, RedBand, GoldBand } from "../components/Layout";
import { Reveal } from "../components/Effects";
import { SupaDupa, GingerMan, LuvALotGirl, AllStarFootballer, JokerHat } from "../components/Characters";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Our Full Range — Golden Fresh Biscuits" },
      { name: "description", content: "Nine ranges. Every moment. Every South African family. Explore Glucose Energy, Just Ginger, Luv-A-Lot, Trio, All-Star, Joker, Marie, Cream Biscuits and Supa Dupa." },
    ],
  }),
  component: Products,
});

type Product = { name: string; desc: string; color: string; emoji: string };

const RANGES: { key: string; name: string; accent: string; desc: string; Mascot?: any; products: Product[] }[] = [
  {
    key: "glucose", name: "Glucose Energy", accent: "#F5A800",
    desc: "South Africa's lunchbox legend. Pure, honest energy in every pack.",
    products: [
      { name: "Glucose Energy", desc: "Classic yellow box. Super Energy Glucose Biscuits, Milk & Honey variant. 48 pkts.", color: "#F5A800", emoji: "⚡" },
      { name: "Super Energy Glucose", desc: "Red box. Super Energy Glucose Biscuits.", color: "#C41C1C", emoji: "⚡" },
      { name: "Supa Dupa Glucose", desc: "Red sunburst box. Glucose Energy Biscuits, 48's.", color: "#E8453A", emoji: "💥" },
    ],
  },
  {
    key: "ginger", name: "Just Ginger", accent: "#1A4B8C", Mascot: GingerMan,
    desc: "Warm, spicy ginger biscuits with real heritage. Hawker line favourite.",
    products: [
      { name: "Just Ginger", desc: "Blue hawker line box (48 × 5pcs). Orange bag variant. Enriched Energy Biscuits.", color: "#E8751A", emoji: "🍪" },
    ],
  },
  {
    key: "luvalot", name: "Luv-A-Lot", accent: "#D4237A", Mascot: LuvALotGirl,
    desc: "High Energy Biscuits. Super Energy for School. A schoolbag essential.",
    products: [
      { name: "Luv-A-Lot", desc: "Pink hawker line box (48 × 5pcs). Pink bag variant. High Energy Biscuits.", color: "#D4237A", emoji: "💖" },
    ],
  },
  {
    key: "trio", name: "Trio", accent: "#6B3A2A",
    desc: "Three flavours, one cream-filled bite. Triple-stacked indulgence.",
    products: [
      { name: "Trio Chocolate", desc: "Brown box. Chocolate Cream Biscuits.", color: "#6B3A2A", emoji: "🍫" },
      { name: "Trio Peanut Butter", desc: "Gold/orange box. Peanut Butter Cream Biscuits.", color: "#C88400", emoji: "🥜" },
      { name: "Trio Strawberry", desc: "Pink/red box. Strawberry Cream Biscuits.", color: "#E8453A", emoji: "🍓" },
      { name: "Trio Choc & Vanilla", desc: "Purple box. Chocolate and Vanilla Cream Biscuits.", color: "#5B3A8C", emoji: "🍦" },
    ],
  },
  {
    key: "allstar", name: "All-Star", accent: "#C41C1C", Mascot: AllStarFootballer,
    desc: "Cream-filled goals. The MVP of cream biscuits across South Africa.",
    products: [
      { name: "All-Star Vanilla", desc: "Blue box. Vanilla Cream Biscuits.", color: "#1A4B8C", emoji: "⚽" },
      { name: "All-Star Chocolate", desc: "Brown/terracotta box. Chocolate Cream Biscuits.", color: "#6B3A2A", emoji: "⚽" },
      { name: "All-Star Choc Vanilla", desc: "Purple box. Choc Vanilla Cream Biscuits.", color: "#5B3A8C", emoji: "⚽" },
      { name: "All-Star Choc Mint", desc: "Green box. Choc Mint Cream Biscuits.", color: "#2EAA4A", emoji: "⚽" },
      { name: "All-Star Strawberry", desc: "Pink box. Strawberry Cream Biscuits.", color: "#D4237A", emoji: "⚽" },
    ],
  },
  {
    key: "joker", name: "Joker", accent: "#2EAA4A", Mascot: JokerHat,
    desc: "Three colours, one cheeky grin. Cream biscuits with playful flair.",
    products: [
      { name: "Joker Chocolate", desc: "Chocolate Flavoured Cream Biscuits.", color: "#6B3A2A", emoji: "🎭" },
      { name: "Joker Strawberry", desc: "Pink box. Strawberry Flavoured Cream Biscuits. 48 × 30g.", color: "#D4237A", emoji: "🎭" },
      { name: "Joker Mint", desc: "Green box. Chocolate Mint Flavoured. 48 × 30g.", color: "#2EAA4A", emoji: "🎭" },
    ],
  },
  {
    key: "marie", name: "Marie", accent: "#1A4B8C",
    desc: "The classic. The original. The biscuit that started a tea-time tradition.",
    products: [
      { name: "Marie Biscuit", desc: "Blue box. The Original Marie Biscuit. 12 × 150g.", color: "#1A4B8C", emoji: "🫖" },
    ],
  },
  {
    key: "cream", name: "Cream Biscuits", accent: "#C88400",
    desc: "Single packs, fully loaded with cream. Everyday flavour, everyday lekker.",
    products: [
      { name: "Lemon Cream Biscuit", desc: "Red/yellow pack. Original Lemon Cream Biscuits. 150g.", color: "#F5A800", emoji: "🍋" },
      { name: "Vanilla Cream Biscuit", desc: "Blue/yellow pack. Original Vanilla Cream Biscuits. 150g.", color: "#1A4B8C", emoji: "🍦" },
      { name: "Chocmint Cream Biscuit", desc: "Green/red pack. Original Chocmint Cream Biscuits. 140g.", color: "#2EAA4A", emoji: "🌿" },
      { name: "Chocolate Cream", desc: "Brown bag. Chocolate Cream Filled Flavoured Biscuits.", color: "#6B3A2A", emoji: "🍫" },
      { name: "Lemon Cream Bag", desc: "Yellow/blue bag. Lemon Cream Filled Flavoured Biscuits.", color: "#FFCF47", emoji: "🍋" },
      { name: "Choc Chip Biscuits", desc: "Loaded with real chocolate chips.", color: "#5C2F1B", emoji: "🍫" },
    ],
  },
  {
    key: "supadupa", name: "Supa Dupa", accent: "#C41C1C", Mascot: SupaDupa,
    desc: "Caped crusader of energy. Sunburst pack, superhero power.",
    products: [
      { name: "Supa Dupa Glucose", desc: "Red sunburst hawker line box. 48's. Glucose Energy Biscuits.", color: "#C41C1C", emoji: "💥" },
    ],
  },
];

const TABS = [{ key: "all", label: "All" }, ...RANGES.map((r) => ({ key: r.key, label: r.name }))];

function Products() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? RANGES : RANGES.filter((r) => r.key === filter);
  return (
    <>
      <section className="products-hero">
        <SectionTag>The Full Family</SectionTag>
        <h1>Our <span className="accent">Full Range</span></h1>
        <p>Nine ranges. Every moment. Every South African family.</p>
      </section>

      <div className="filter-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`filter-tab ${filter === t.key ? "active" : ""}`} onClick={() => setFilter(t.key)}>
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
            {r.Mascot && <div className="range-mascot"><r.Mascot size={140} /></div>}
          </Reveal>
          <div className="grid-3">
            {r.products.map((p) => (
              <Reveal key={p.name} className="prod-card">
                <div className="prod-top" style={{ background: `linear-gradient(135deg, ${p.color}33, ${p.color}88)` }}>
                  <span style={{ fontSize: 72 }}>{p.emoji}</span>
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
