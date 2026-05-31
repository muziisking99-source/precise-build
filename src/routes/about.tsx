import { createFileRoute } from "@tanstack/react-router";
import { SectionTag, RedBand } from "../components/Layout";
import { Reveal } from "../components/Effects";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Golden Fresh Biscuits" },
      { name: "description", content: "Baked with pride since 1998. Golden Fresh was born in Lenasia and feeds South African families with quality, affordable biscuits." },
    ],
  }),
  component: About,
});

const VALUES = [
  { icon: "🏭", t: "Made in SA", b: "Baked in Lenasia, Johannesburg. Local jobs, local pride." },
  { icon: "💰", t: "Honest Prices", b: "Quality biscuits within reach of every South African family." },
  { icon: "🌿", t: "Real Ingredients", b: "No shortcuts. Only the finest ingredients, baked with care." },
];

const MILESTONES = [
  { y: "1998", t: "Founded in Lenasia by Yunma Foods." },
  { y: "2002", t: "Glucose Energy becomes SA's go-to lunchbox biscuit." },
  { y: "2008", t: "Joker and All-Star ranges launched." },
  { y: "2015", t: "Expanded to all 9 provinces." },
  { y: "2024", t: "Nine product ranges, millions of families." },
];

const ROW_VALUES = [
  { icon: "🤝", t: "Community", b: "We bake for our neighbours, our cousins, our country." },
  { icon: "✨", t: "Quality", b: "Every biscuit, every box — to the same proud standard." },
  { icon: "💛", t: "Affordability", b: "Lekkerness should never cost too much." },
  { icon: "🇿🇦", t: "Proudly SA", b: "Made here. Loved here. Born here." },
];

function About() {
  return (
    <>
      <section className="about-hero">
        <SectionTag>Our Story</SectionTag>
        <h1>Baked With <span className="accent">Pride</span> Since <span className="accent">1998</span></h1>
        <p>Golden Fresh was born in Lenasia, Johannesburg — and has been feeding South African families with quality, affordable biscuits ever since.</p>
      </section>

      <section className="section section-cream">
        <div className="mission-grid">
          <Reveal>
            <SectionTag>Our Mission</SectionTag>
            <p className="mission-quote">Delivering local lekkerness to every South African table since 1998.</p>
          </Reveal>
          <Reveal>
            {VALUES.map((v) => (
              <div key={v.t} className="value-card">
                <div className="value-card-icon">{v.icon}</div>
                <div className="value-card-title">{v.t}</div>
                <p className="value-card-body">{v.b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section-warm">
        <Reveal className="section-head">
          <SectionTag>Our Journey</SectionTag>
          <h2>25 Years of <span className="accent">Lekkerness</span></h2>
        </Reveal>
        <div className="timeline">
          {MILESTONES.map((m) => (
            <Reveal key={m.y} className="timeline-item">
              <div className="timeline-year">{m.y}</div>
              <div className="timeline-dot" />
              <p className="timeline-text">{m.t}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-white">
        <Reveal className="section-head">
          <SectionTag>What We Stand For</SectionTag>
          <h2>The <span className="accent">Golden</span> Values</h2>
        </Reveal>
        <div className="grid-4">
          {ROW_VALUES.map((v) => (
            <Reveal key={v.t} className="value-card" style={{ textAlign: "center" }}>
              <div className="value-card-icon" style={{ fontSize: 36 }}>{v.icon}</div>
              <div className="value-card-title">{v.t}</div>
              <p className="value-card-body">{v.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="stats-bar">
        <div><div className="stats-bar-num">25+</div><div className="stats-bar-label">Years</div></div>
        <div><div className="stats-bar-num">9</div><div className="stats-bar-label">Ranges</div></div>
        <div><div className="stats-bar-num">9</div><div className="stats-bar-label">Provinces</div></div>
        <div><div className="stats-bar-num">1M+</div><div className="stats-bar-label">Families</div></div>
      </div>

      <RedBand title="Want to stock Golden Fresh?" body="We partner with spaza shops, supermarkets, and wholesalers nationwide." cta="Become a Stockist" />
    </>
  );
}
