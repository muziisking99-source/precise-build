import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { Logo } from "./Logo";

const HERO_STATS = [
  { num: "25+", label: "Years Baking" },
  { num: "9", label: "Ranges" },
  { num: "9", label: "Provinces" },
] as const;

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-badge hero-animate" style={{ "--i": 0 } as CSSProperties}>
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
            <Logo height={140} className="hero-logo" />
          </div>

          <p className="hero-sub hero-animate" style={{ "--i": 3 } as CSSProperties}>
            From Lenasia to the nation — Golden Fresh delivers real quality at honest prices. Nine beloved ranges, millions of happy families.
          </p>

          <div className="hero-buttons hero-animate" style={{ "--i": 4 } as CSSProperties}>
            <Link to="/products" className="btn btn-red">Shop Products</Link>
            <Link to="/about" className="btn btn-ghost">Our Story →</Link>
          </div>
        </div>

        <div className="hero-visual hero-animate" style={{ "--i": 5 } as CSSProperties}>
          <div className="hero-logo-stage">
            <Logo height={280} className="hero-logo" />
          </div>
        </div>
      </div>

      <div className="hero-stats-bar hero-animate" style={{ "--i": 6 } as CSSProperties}>
        {HERO_STATS.map((stat, index) => (
          <div key={stat.label} className={`hero-stat${index > 0 ? " hero-stat--divided" : ""}`}>
            <div className="hero-stat-num">{stat.num}</div>
            <div className="hero-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
