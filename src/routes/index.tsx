import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionTag, RedBand, GoldBand } from "../components/Layout";
import { Reveal } from "../components/Effects";
import { CHARACTERS, SupaDupa, GingerMan, LuvALotGirl, AllStarFootballer, JokerHat } from "../components/Characters";
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

const RIBBON_ITEMS = ["Glucose Energy","Just Ginger","Luv-A-Lot","Trio","All-Star","Joker","Marie","Supa Dupa","Cream Biscuits","Proudly South African"];

const TEASERS = [
  { name: "Glucose Energy", Comp: SupaDupa, desc: "South Africa's lunchbox legend. Pure, honest energy.", color: "#FFF200" },
  { name: "Just Ginger", Comp: GingerMan, desc: "Warm spice in every bite. A heritage classic.", color: "#8C6239" },
  { name: "Luv-A-Lot", Comp: LuvALotGirl, desc: "Sweet school-bag bestie. Loved by kids nationwide.", color: "#ED1C24" },
  { name: "All-Star", Comp: AllStarFootballer, desc: "Cream-filled goals. Game-day favourite.", color: "#00A651" },
  { name: "Trio", Comp: SupaDupa, desc: "Three flavours, one cream-filled bite.", color: "#C59B6D" },
  { name: "Joker", Comp: JokerHat, desc: "Three colours, one cheeky grin.", color: "#00A651" },
];

function Index() {
  return (
    <>
      <section className="hero">
        <div className="hero-glow-1" /><div className="hero-glow-2" /><div className="hero-grid-lines" />
        <div className="hero-left">
          <div className="hero-badge"><span className="hero-badge-dot" />Proudly South African · Est. 1998</div>
          <h1>
            Lekker
            <span className="gold">Biscuits</span>
            For Every
            <span> <span className="red">SA Family.</span></span>
          </h1>
          <p className="hero-sub">From Lenasia to the nation — Golden Fresh delivers real quality at honest prices. Nine beloved ranges, millions of happy families.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-red">Shop Products</Link>
            <Link to="/about" className="btn btn-ghost">Our Story →</Link>
          </div>
          <div className="hero-stats">
            <div><div className="hero-stat-num">25+</div><div className="hero-stat-label">Years Baking</div></div>
            <div><div className="hero-stat-num">9</div><div className="hero-stat-label">Ranges</div></div>
            <div><div className="hero-stat-num">9</div><div className="hero-stat-label">Provinces</div></div>
          </div>
        </div>
        <div className="hero-right">
          <Logo height={280} className="hero-logo" />
          <div className="info-card info-card-1">
            <div className="info-card-label">Bestseller</div>
            <div className="info-card-title">Glucose Energy</div>
          </div>
          <div className="info-card info-card-2">
            <div className="info-card-label">Kids' Favourite</div>
            <div className="info-card-title">Luv-A-Lot</div>
          </div>
        </div>
      </section>

      <div className="ribbon">
        <div className="ribbon-track">
          {[...RIBBON_ITEMS, ...RIBBON_ITEMS, ...RIBBON_ITEMS, ...RIBBON_ITEMS].map((it, i) => (
            <span key={i} className="ribbon-item">{it}<span className="ribbon-sep"> ✦ </span></span>
          ))}
        </div>
      </div>

      <section className="section section-cream">
        <Reveal className="section-head">
          <SectionTag>Our Ranges</SectionTag>
          <h2>A Biscuit for Every <span className="accent">Moment</span></h2>
          <p className="section-sub">Nine ranges, baked in Lenasia and loved across all nine provinces.</p>
        </Reveal>
        <div className="grid-3">
          {TEASERS.map((p) => {
            const Mascot = p.Comp;
            return (
            <Reveal key={p.name} className="prod-card">
              <div className="prod-top prod-mascot" style={{ background: `linear-gradient(135deg, ${p.color}22, ${p.color}55)` }}>
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
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Link to="/products" className="btn btn-red">View All Products →</Link>
        </div>
      </section>

      <section className="section section-navy">
        <Reveal className="section-head">
          <SectionTag>The Real Characters</SectionTag>
          <h2>Meet the <span className="accent">Biscuit Gang</span></h2>
          <p className="section-sub">The real mascots from the real packs — proudly part of every Golden Fresh box.</p>
        </Reveal>
        <div className="grid-5">
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
      </section>

      <section className="section section-cream">
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
          <Reveal>
            <SectionTag>Our Heritage</SectionTag>
            <h2 style={{ fontSize: "clamp(36px, 4.5vw, 52px)" }}>Baked in Lenasia. <span style={{ color: "var(--red)" }}>Loved Nationwide.</span></h2>
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
      </section>

      <GoldBand title="Find Your Favourite Biscuit!" body="Nine ranges. Every flavour. Every South African table." cta="Shop All Products" />

      <section className="section section-white">
        <Reveal className="section-head">
          <SectionTag>Word on the Street</SectionTag>
          <h2>From <span className="accent">SA Families</span></h2>
        </Reveal>
        <div className="grid-3">
          {[
            { q: "Golden Fresh has been in my kids' lunchboxes since they started school. Quality and price — both spot on.", n: "Thandi M.", w: "Soweto, Gauteng" },
            { q: "Best Glucose biscuit in the country. The shop never runs out — we make sure of it.", n: "Pravesh N.", w: "Phoenix, KZN" },
            { q: "My oupa ate Just Ginger. My kids eat Just Ginger. That's South African heritage.", n: "Liesel V.", w: "Stellenbosch, WC" },
          ].map((t) => (
            <Reveal key={t.n} className="testi-card">
              <p className="testi-quote">"{t.q}"</p>
              <div className="testi-author">
                <div className="testi-name">{t.n}</div>
                <div className="testi-where">{t.w}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <RedBand title="Find Golden Fresh Near You" body="From spaza shops to supermarkets, we're in every province. Find your nearest stockist." cta="Find a Stockist" />
    </>
  );
}
