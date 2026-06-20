import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SectionTag } from "../components/Layout";
import { Section, SectionHead } from "../components/Section";
import { Reveal } from "../components/Effects";
import { SiteSectionLoading } from "../components/SiteSectionLoading";

import { CharacterMarquee } from "../components/CharacterMarquee";
import { CHARACTERS, SupaDupa, GingerMan, LuvALotGirl, AllStarFootballer, JokerHat } from "../components/Characters";
import { SnapHero } from "../components/SnapHero";
import { Logo } from "../components/Logo";
import { parseRibbonItems } from "@/lib/queries/fetchers";
import { resolveSiteStats } from "@/lib/siteCopy";
import {
  charactersQueryOptions,
  homeRangesQueryOptions,
  prefetchHomePage,
  siteSettingsQueryOptions,
  testimonialsQueryOptions,
} from "@/lib/queries/options";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) => prefetchHomePage(queryClient),
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

function Index() {
  const { data: ranges = [], isPending: rangesLoading } = useQuery(homeRangesQueryOptions());
  const { data: characters = [], isPending: charactersLoading } = useQuery(charactersQueryOptions());
  const { data: testimonials = [], isPending: testimonialsLoading } = useQuery(testimonialsQueryOptions());
  const { data: settings, isPending: settingsLoading } = useQuery(siteSettingsQueryOptions());

  const ribbon = settings?.ribbon_items
    ? parseRibbonItems(settings.ribbon_items)
    : settingsLoading
      ? []
      : FALLBACK_RIBBON;

  const siteCopy = {
    heritage_ranges: settings?.heritage_ranges || FALLBACK_SITE.heritage_ranges,
    heritage_families: settings?.heritage_families || FALLBACK_SITE.heritage_families,
    home_ranges_subtitle: settings?.home_ranges_subtitle || FALLBACK_SITE.home_ranges_subtitle,
  };
  const stats = resolveSiteStats(settings);

  const chars = characters.length
    ? characters
    : charactersLoading
      ? []
      : CHARACTERS.map((c) => ({ id: c.name, name: c.name, range: c.range, description: c.desc, pill_text: c.tag, image_url: null }));

  const testis = testimonials.length
    ? testimonials
    : testimonialsLoading
      ? []
      : FALLBACK_TESTIMONIALS.map((t, i) => ({ id: String(i), ...t }));

  const [featured, ...restRanges] = ranges;

  return (
    <>
      <SnapHero />

      {settingsLoading ? (
        <SiteSectionLoading variant="ribbon" />
      ) : (
        <div className="ribbon">
          <div className="ribbon-track">
            {[...ribbon, ...ribbon, ...ribbon, ...ribbon].map((it, i) => (
              <span key={i} className="ribbon-item">{it}<span className="ribbon-sep"> · </span></span>
            ))}
          </div>
        </div>
      )}

      <Section variant="cream">
        <Reveal>
          <SectionHead
            eyebrow="Our Ranges"
            title={<>A Biscuit for Every <span className="accent">Moment</span></>}
            subtitle={settingsLoading ? "" : siteCopy.home_ranges_subtitle}
          />
        </Reveal>

        {rangesLoading ? (
          <SiteSectionLoading variant="ranges" />
        ) : (
          <>
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
          </>
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
        {charactersLoading ? (
          <SiteSectionLoading variant="characters" />
        ) : (
          <CharacterMarquee characters={chars} />
        )}
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
              <div className="heritage-stat"><div className="heritage-stat-num">{stats.years}</div><div className="heritage-stat-label">Years Baking</div></div>
              <div className="heritage-stat"><div className="heritage-stat-num">{stats.ranges}</div><div className="heritage-stat-label">Ranges</div></div>
              <div className="heritage-stat"><div className="heritage-stat-num">{stats.provinces}</div><div className="heritage-stat-label">Provinces</div></div>
              <div className="heritage-stat"><div className="heritage-stat-num">{stats.families}</div><div className="heritage-stat-label">Happy Families</div></div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section variant="white">
        <Reveal>
          <SectionHead
            align="center"
            eyebrow="Word on the Street"
            title={<>From <span className="accent">SA Families</span></>}
          />
        </Reveal>
        {testimonialsLoading ? (
          <SiteSectionLoading variant="testimonials" />
        ) : (
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
        )}
      </Section>
    </>
  );
}
