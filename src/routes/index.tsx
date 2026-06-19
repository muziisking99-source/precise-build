import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionTag, GoldBand } from "../components/Layout";
import { Section, SectionHead } from "../components/Section";
import { Reveal } from "../components/Effects";

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

const FALLBACK_SITE = {
  heritage_ranges: "11",
  heritage_families: "5M+",
  home_ranges_subtitle: "11 ranges, baked in Lenasia and loved across all nine provinces.",
  gold_band_body: "11 ranges. Every flavour. Every South African table.",
};

const FALLBACK_RIBBON = ["Glucose Energy", "Just Ginger", "Luv-A-Lot", "Trio", "All-Star", "Joker", "Marie", "Supa Dupa", "Cream Biscuits", "Proudly South African"];

const FEATURED_RANGE_DISPLAY: Record<string, string> = {
  glucose: "Energy Glucose",
};

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

type RangeRow = { id: string; slug: string; name: string; description: string | null; sort_order: number; image_url?: string | null };
type CharacterRow = { id: string; name: string; range: string | null; description: string | null; pill_text: string | null; image_url: string | null };
type TestimonialRow = { id: string; quote: string; name: string; location: string | null };

function Index() {
  const [ranges, setRanges] = useState<RangeRow[]>([]);
  const [characters, setCharacters] = useState<CharacterRow[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [ribbon, setRibbon] = useState<string[]>(FALLBACK_RIBBON);
  const [siteCopy, setSiteCopy] = useState(FALLBACK_SITE);

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
          return { id: r.id, slug: r.slug, name: r.name, description: r.description, sort_order: r.sort_order, image_url: firstImg };
        });
        setRanges(mapped);
      }
    })();
    supabase.from("characters").select("id, name, range, description, pill_text, image_url").eq("is_visible", true).order("sort_order")
      .then(({ data }) => { if (data && data.length) setCharacters(data as CharacterRow[]); });
    supabase.from("testimonials").select("id, quote, name, location").eq("is_visible", true).order("sort_order").limit(6)
      .then(({ data }) => { if (data && data.length) setTestimonials(data as TestimonialRow[]); });
    supabase.from("site_settings").select("key, value").in("key", ["ribbon_items", ...Object.keys(FALLBACK_SITE)])
      .then(({ data }) => {
        if (!data?.length) return;
        const copy = { ...FALLBACK_SITE };
        data.forEach((row) => {
          if (row.key === "ribbon_items" && row.value) {
            setRibbon(row.value.split(/\s*·\s*|\s*\|\s*|,\s*/).filter(Boolean));
          } else if (row.key in copy && row.value) {
            copy[row.key as keyof typeof copy] = row.value;
          }
        });
        setSiteCopy(copy);
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
            subtitle={siteCopy.home_ranges_subtitle}
          />
        </Reveal>
        {featured && (
          <Reveal className="range-featured" style={{ ["--range-colour" as any]: MASCOT_BY_SLUG[featured.slug]?.color ?? "#D4920A" }}>
            <Link to="/products" className="range-featured-link">
              <div className="range-featured-media">
                {featured.image_url ? (
                  <img src={featured.image_url} alt={FEATURED_RANGE_DISPLAY[featured.slug] ?? featured.name} />
                ) : (
                  <div className="range-featured-fallback" aria-hidden />
                )}
              </div>
              <div className="range-featured-content">
                <h3>{FEATURED_RANGE_DISPLAY[featured.slug] ?? featured.name}</h3>
                <p>{featured.description ?? "Discover the range that started a South African biscuit tradition."}</p>
                <span className="range-featured-cta">Explore Range →</span>
              </div>
            </Link>
          </Reveal>
        )}

        {restRanges.length > 0 && (
          <div className="ranges-grid">
            {restRanges.map((r) => {
              const colour = MASCOT_BY_SLUG[r.slug]?.color ?? "#D4920A";
              return (
                <Reveal key={r.id} className="range-card" style={{ ["--range-colour" as any]: colour }}>
                  <Link to="/products" className="range-card-link">
                    <div className={`range-card-image ${r.image_url ? "" : "no-image"}`}>
                      {r.image_url ? <img src={r.image_url} alt={r.name} /> : <span className="range-card-fallback" aria-hidden />}
                    </div>
                    <div className="range-card-body">
                      <div className="range-card-name">{r.name}</div>
                      <span className="range-card-arrow">Explore →</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="section-cta">
          <Link to="/products" className="btn-outline-dark">View All Products →</Link>
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
                <div className="char-card-visual">
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} className="char-card-img" />
                  ) : (
                    <Comp size={90} />
                  )}
                </div>
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
          <Reveal className="heritage-visual">
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
              <div className="heritage-stat"><div className="heritage-stat-num">{siteCopy.heritage_ranges}</div><div className="heritage-stat-label">Ranges</div></div>
              <div className="heritage-stat"><div className="heritage-stat-num">9</div><div className="heritage-stat-label">Provinces</div></div>
              <div className="heritage-stat"><div className="heritage-stat-num">{siteCopy.heritage_families}</div><div className="heritage-stat-label">Happy Families</div></div>
            </div>
          </Reveal>
        </div>
      </Section>

      <GoldBand title="Find Your Favourite Biscuit!" body={siteCopy.gold_band_body} cta="Shop All Products" />

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
    </>
  );
}
