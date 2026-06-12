import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionTag, RedBand, GoldBand } from "../components/Layout";
import { Section, SectionHead } from "../components/Section";
import { Reveal } from "../components/Effects";
import { productTopStyle } from "../lib/uiTint";
import { CHARACTERS, SupaDupa, GingerMan, LuvALotGirl, AllStarFootballer, JokerHat } from "../components/Characters";
import { SnapHero } from "../components/SnapHero";
import { Logo } from "../components/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Golden Fresh Biscuits — Lekker Biscuits For Every SA Family" },
      { name: "description", content: "From Lenasia to the nation — Golden Fresh delivers real quality at honest prices. Nine beloved ranges since 1998." },
    ],
  }),
  component: Index,
});

const FALLBACK_RIBBON = ["Glucose Energy", "Just Ginger", "Luv-A-Lot", "Trio", "All-Star", "Joker", "Marie", "Supa Dupa", "Cream Biscuits", "Proudly South African"];

const MASCOT_BY_SLUG: Record<string, { Comp: React.ComponentType<{ size?: number }>; color: string }> = {
  glucose: { Comp: SupaDupa, color: "#FFF200" },
  supadupa: { Comp: SupaDupa, color: "#FFF200" },
  ginger: { Comp: GingerMan, color: "#8C6239" },
  luvalot: { Comp: LuvALotGirl, color: "#ED1C24" },
  allstar: { Comp: AllStarFootballer, color: "#00A651" },
  trio: { Comp: SupaDupa, color: "#C59B6D" },
  joker: { Comp: JokerHat, color: "#00A651" },
  marie: { Comp: GingerMan, color: "#C59B6D" },
  cream: { Comp: LuvALotGirl, color: "#ED1C24" },
};

const FALLBACK_TESTIMONIALS = [
  { quote: "Golden Fresh has been in my kids' lunchboxes since they started school. Quality and price — both spot on.", name: "Thandi M.", location: "Soweto, Gauteng" },
  { quote: "Best Glucose biscuit in the country. The shop never runs out — we make sure of it.", name: "Pravesh N.", location: "Phoenix, KZN" },
  { quote: "My oupa ate Just Ginger. My kids eat Just Ginger. That's South African heritage.", name: "Liesel V.", location: "Stellenbosch, WC" },
];

type RangeRow = { id: string; slug: string; name: string; description: string | null; sort_order: number; product_count?: number; image_url?: string | null };
type CharacterRow = { id: string; name: string; range: string | null; description: string | null; pill_text: string | null; image_url: string | null };
type TestimonialRow = { id: string; quote: string; name: string; location: string | null };

function Index() {
  const [ranges, setRanges] = useState<RangeRow[]>([]);
  const [characters, setCharacters] = useState<CharacterRow[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [ribbon, setRibbon] = useState<string[]>(FALLBACK_RIBBON);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("product_ranges")
        .select("id, slug, name, description, sort_order, products(image_url)")
        .order("sort_order");
      if (data && data.length) {
        const mapped: RangeRow[] = (data as any[]).map((r) => {
          const products = (r.products ?? []) as { image_url: string | null }[];
          const firstImg = products.find((p) => p.image_url)?.image_url ?? null;
          return { id: r.id, slug: r.slug, name: r.name, description: r.description, sort_order: r.sort_order, product_count: products.length, image_url: firstImg };
        });
        setRanges(mapped);
      }
    })();
    supabase.from("characters").select("id, name, range, description, pill_text, image_url").eq("is_visible", true).order("sort_order")
      .then(({ data }) => { if (data && data.length) setCharacters(data as CharacterRow[]); });
    supabase.from("testimonials").select("id, quote, name, location").eq("is_visible", true).order("sort_order").limit(6)
      .then(({ data }) => { if (data && data.length) setTestimonials(data as TestimonialRow[]); });
    supabase.from("site_settings").select("key, value").eq("key", "ribbon_items")
      .then(({ data }) => {
        const v = data?.[0]?.value;
        if (v) setRibbon(v.split(/\s*·\s*|\s*\|\s*|,\s*/).filter(Boolean));
      });
  }, []);

  const chars = characters.length ? characters : CHARACTERS.map((c) => ({ id: c.name, name: c.name, range: c.range, description: c.desc, pill_text: c.tag, image_url: null }));
  const testis = testimonials.length ? testimonials : FALLBACK_TESTIMONIALS.map((t, i) => ({ id: String(i), ...t }));
  const [featured, ...restRanges] = ranges;

  return (
    <>
      <SnapHero />

      <div className="ribbon">
        <div className="ribbon-track">
          {[...ribbon, ...ribbon, ...ribbon, ...ribbon].map((it, i) => (
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
          {teasers.map((p, i) => {
            const m = MASCOT_BY_SLUG[p.slug] ?? { Comp: SupaDupa, color: "#FFF200" };
            const Mascot = m.Comp;
            return (
              <Reveal
                key={p.id}
                className={`prod-card prod-card--zigzag ${i % 2 === 1 ? "prod-card--reverse" : ""}`}
              >
                <div className="prod-top prod-mascot" style={productTopStyle(m.color)}>
                  <Mascot size={100} />
                </div>
                <div className="prod-body">
                  <div className="prod-pill">Range</div>
                  <div className="prod-name">{p.name}</div>
                  <p className="prod-desc">{p.description ?? ""}</p>
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
          {chars.map((c) => {
            const fallback = CHARACTERS.find((x) => x.name === c.name || x.range === c.range);
            const Comp = fallback?.Comp ?? SupaDupa;
            return (
              <Reveal key={c.id} className="char-card">
                {c.image_url ? <img src={c.image_url} alt={c.name} style={{ width: 110, height: 110, objectFit: "contain" }} /> : <Comp />}
                <div className="char-name">{c.name}</div>
                <div className="char-range">{c.range}</div>
                <p className="char-desc">{c.description}</p>
                <div className="char-pill">{c.pill_text}</div>
              </Reveal>
            );
          })}
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
          {testis.map((t, i) => (
            <Reveal key={t.id} className={`testi-card ${i === 0 ? "testi-card--featured" : ""}`}>
              <p className="testi-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="testi-author">
                <div className="testi-name">{t.name}</div>
                <div className="testi-where">{t.location}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <RedBand title="Find Golden Fresh Near You" body="From spaza shops to supermarkets, we're in every province. Find your nearest stockist." cta="Find a Stockist" />
    </>
  );
}
