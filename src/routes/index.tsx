import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionTag, RedBand, GoldBand } from "../components/Layout";
import { Section, SectionHead } from "../components/Section";
import { Reveal } from "../components/Effects";
import { productTopStyle } from "../lib/uiTint";
import { CHARACTERS, SupaDupa, GingerMan, LuvALotGirl, AllStarFootballer, JokerHat } from "../components/Characters";
import { SnapHero } from "../components/SnapHero";
import { Logo } from "../components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Golden Fresh Biscuits — Lekker Biscuits For Every SA Family" },
      { name: "description", content: "From Lenasia to the nation — Golden Fresh delivers real quality at honest prices. Nine beloved ranges since 1998." },
    ],
  }),
  component: Index,
});

const RIBBON_ITEMS = ["Glucose Energy", "Just Ginger", "Luv-A-Lot", "Trio", "All-Star", "Joker", "Marie", "Supa Dupa", "Cream Biscuits", "Proudly South African"];

const TEASERS = [
  { name: "Glucose Energy", Comp: SupaDupa, desc: "South Africa's lunchbox legend. Pure, honest energy.", color: "#FFF200" },
  { name: "Just Ginger", Comp: GingerMan, desc: "Warm spice in every bite. A heritage classic.", color: "#8C6239" },
  { name: "Luv-A-Lot", Comp: LuvALotGirl, desc: "Sweet school-bag bestie. Loved by kids nationwide.", color: "#ED1C24" },
  { name: "All-Star", Comp: AllStarFootballer, desc: "Cream-filled goals. Game-day favourite.", color: "#00A651" },
  { name: "Trio", Comp: SupaDupa, desc: "Three flavours, one cream-filled bite.", color: "#C59B6D" },
  { name: "Joker", Comp: JokerHat, desc: "Three colours, one cheeky grin.", color: "#00A651" },
];

const TESTIMONIALS = [
  { q: "Golden Fresh has been in my kids' lunchboxes since they started school. Quality and price — both spot on.", n: "Thandi M.", w: "Soweto, Gauteng", featured: true },
  { q: "Best Glucose biscuit in the country. The shop never runs out — we make sure of it.", n: "Pravesh N.", w: "Phoenix, KZN", featured: false },
  { q: "My oupa ate Just Ginger. My kids eat Just Ginger. That's South African heritage.", n: "Liesel V.", w: "Stellenbosch, WC", featured: false },
];

function Index() {
  return (
    <>
      <Hero />

      <div className="ribbon">
        <div className="ribbon-track">
          {[...RIBBON_ITEMS, ...RIBBON_ITEMS, ...RIBBON_ITEMS, ...RIBBON_ITEMS].map((it, i) => (
            <span key={i} className="ribbon-item">{it}<span className="ribbon-sep"> · </span></span>
          ))}
        </div>
      </div>

      <Section variant="cream">
        <Reveal>
          <SectionHead
            eyebrow="Our Ranges"
            title={<>A Biscuit for Every <span className="accent">Moment</span></>}
            subtitle="Nine ranges, baked in Lenasia and loved across all nine provinces."
          />
        </Reveal>
        <div className="grid-zigzag">
          {TEASERS.map((p, i) => {
            const Mascot = p.Comp;
            return (
              <Reveal
                key={p.name}
                className={`prod-card prod-card--zigzag ${i % 2 === 1 ? "prod-card--reverse" : ""}`}
              >
                <div className="prod-top prod-mascot" style={productTopStyle(p.color)}>
                  <Mascot size={100} />
                </div>
                <div className="prod-body">
                  <div className="prod-pill">Range</div>
                  <div className="prod-name">{p.name}</div>
                  <p className="prod-desc">{p.desc}</p>
                  <Link to="/products/single" className="prod-link">Find It →</Link>
                </div>
              </Reveal>
            );
          })}
        </div>
        <div className="section-cta">
          <Link to="/products" className="btn btn-red">View All Products →</Link>
        </div>
      </Section>

      <Section variant="warm" className="section-navy">
        <Reveal>
          <SectionHead
            eyebrow="The Real Characters"
            title={<>Meet the <span className="accent">Biscuit Gang</span></>}
            subtitle="The real mascots from the real packs — proudly part of every Golden Fresh box."
          />
        </Reveal>
        <div className="char-scroll">
          {CHARACTERS.map(({ Comp, name, range, desc, tag }) => (
            <Reveal key={name} className="char-card">
              <Comp />
              <div className="char-name">{name}</div>
              <div className="char-range">{range}</div>
              <p className="char-desc">{desc}</p>
              <div className="char-pill">{tag}</div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section variant="cream">
        <div className="heritage-grid">
          <Reveal>
            <div className="heritage-logo-wrap">
              <Logo height={220} />
            </div>
            <div className="heritage-badge">
              <span className="heritage-badge-year">1998</span>
              <span className="heritage-badge-text">Est. Lenasia, JHB</span>
            </div>
          </Reveal>
          <Reveal className="heritage-copy">
            <SectionTag>Our Heritage</SectionTag>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)" }}>Baked in Lenasia. <span style={{ color: "var(--red)" }}>Loved Nationwide.</span></h2>
            <p style={{ color: "var(--mid)", lineHeight: 1.7, marginTop: 18, fontSize: 16 }}>
              For over a quarter-century, Golden Fresh — a Yunma Foods brand — has been baking honest, affordable biscuits for South African families. From spaza shops to supermarkets, our range now fills lunchboxes in every province.
            </p>
            <div className="heritage-stats">
              <div className="heritage-stat"><div className="heritage-stat-num">25+</div><div className="heritage-stat-label">Years Baking</div></div>
              <div className="heritage-stat"><div className="heritage-stat-num">9</div><div className="heritage-stat-label">Ranges</div></div>
              <div className="heritage-stat"><div className="heritage-stat-num">9</div><div className="heritage-stat-label">Provinces</div></div>
              <div className="heritage-stat"><div className="heritage-stat-num">1M+</div><div className="heritage-stat-label">Happy Families</div></div>
            </div>
          </Reveal>
        </div>
      </Section>

      <GoldBand title="Find Your Favourite Biscuit!" body="Nine ranges. Every flavour. Every South African table." cta="Shop All Products" />

      <Section variant="white">
        <Reveal>
          <SectionHead
            align="center"
            eyebrow="Word on the Street"
            title={<>From <span className="accent">SA Families</span></>}
          />
        </Reveal>
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <Reveal key={t.n} className={`testi-card ${t.featured ? "testi-card--featured" : ""}`}>
              <p className="testi-quote">&ldquo;{t.q}&rdquo;</p>
              <div className="testi-author">
                <div className="testi-name">{t.n}</div>
                <div className="testi-where">{t.w}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <RedBand title="Find Golden Fresh Near You" body="From spaza shops to supermarkets, we're in every province. Find your nearest stockist." cta="Find a Stockist" />
    </>
  );
}
