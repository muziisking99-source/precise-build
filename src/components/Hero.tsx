import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { Logo } from "./Logo";

const HERO_STATS = [
  { num: "25+", label: "Years Baking" },
  { num: "9", label: "Ranges" },
  { num: "9", label: "Provinces" },
] as const;

const MARQUEE_ITEMS = [
  "Glucose Energy",
  "Just Ginger",
  "Luv-A-Lot",
  "Trio",
  "All-Star",
  "Joker",
  "Marie",
  "Supa Dupa",
  "Cream Biscuits",
];

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow-1" aria-hidden />
      <div className="hero-glow-2" aria-hidden />
      <div className="hero-slice" aria-hidden />
      <div className="hero-watermark" aria-hidden>1998</div>

      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-copy-rail" aria-hidden />

          <div className="hero-copy-body">
            <div className="hero-badge hero-animate" style={{ "--i": 0 } as CSSProperties}>
              <span className="hero-badge-dot" />
              Proudly South African · Est. 1998
            </div>

            <h1 className="hero-title hero-animate" style={{ "--i": 1 } as CSSProperties}>
              <span className="hero-title-line hero-title-lekker">Lekker</span>
              <span className="hero-title-line hero-title-script gold">Biscuits</span>
              <span className="hero-title-line hero-title-rest">
                For Every <span className="red">SA Family.</span>
              </span>
            </h1>

            <div className="hero-logo-mobile hero-animate" style={{ "--i": 2 } as CSSProperties}>
              <div className="hero-brand-frame hero-brand-frame--mobile">
                <Logo height={160} className="hero-logo" />
              </div>
            </div>

            <p className="hero-sub hero-animate" style={{ "--i": 3 } as CSSProperties}>
              From Lenasia to the nation — Golden Fresh delivers real quality at honest prices. Nine beloved ranges, millions of happy families.
            </p>

            <div className="hero-buttons hero-animate" style={{ "--i": 4 } as CSSProperties}>
              <Link to="/products" className="btn btn-red">Shop Products</Link>
              <Link to="/about" className="btn btn-ghost">Our Story →</Link>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-brand-frame hero-brand-frame--desktop hero-animate" style={{ "--i": 5 } as CSSProperties}>
            <div className="hero-brand-halo" aria-hidden />
            <Logo height={300} className="hero-logo" />
          </div>

          <div className="info-card info-card-1 hero-animate" style={{ "--i": 6 } as CSSProperties}>
            <div className="info-card-label">Bestseller</div>
            <div className="info-card-title">Glucose Energy</div>
          </div>
          <div className="info-card info-card-2 hero-animate" style={{ "--i": 7 } as CSSProperties}>
            <div className="info-card-label">Kids&apos; Favourite</div>
            <div className="info-card-title">Luv-A-Lot</div>
          </div>
        </div>
      </div>

      <div className="hero-stats-bar hero-animate" style={{ "--i": 5 } as CSSProperties}>
        {HERO_STATS.map((stat, index) => (
          <div key={stat.label} className={`hero-stat${index > 0 ? " hero-stat--divided" : ""}`}>
            <div className="hero-stat-num">{stat.num}</div>
            <div className="hero-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="hero-marquee" aria-hidden>
        <div className="hero-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="hero-marquee-item">
              {item}
              <span className="hero-marquee-sep" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
