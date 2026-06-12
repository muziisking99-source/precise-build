import { useMemo } from "react";

const WHEAT_SVG = (
  <svg viewBox="0 0 24 48" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden>
    <line x1="12" y1="48" x2="12" y2="4" stroke="#D4920A" strokeWidth="1.5" opacity="0.6" />
    <ellipse cx="12" cy="8" rx="4" ry="7" fill="#D4920A" opacity="0.5" />
    <ellipse cx="6" cy="16" rx="3.5" ry="6" fill="#D4920A" opacity="0.35" transform="rotate(-30 6 16)" />
    <ellipse cx="18" cy="16" rx="3.5" ry="6" fill="#D4920A" opacity="0.35" transform="rotate(30 18 16)" />
    <ellipse cx="5" cy="26" rx="3" ry="5.5" fill="#D4920A" opacity="0.22" transform="rotate(-25 5 26)" />
    <ellipse cx="19" cy="26" rx="3" ry="5.5" fill="#D4920A" opacity="0.22" transform="rotate(25 19 26)" />
  </svg>
);

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function HeroNavyBackground() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? 5 : 12;

  const grains = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: `${rand(5, 95)}%`,
        delay: `${rand(0, 14)}s`,
        duration: `${rand(12, 22)}s`,
        scale: rand(0.6, 1.4),
        drift: `${rand(-60, 60)}px`,
        rot: `${rand(-20, 20)}deg`,
      })),
    [count]
  );

  return (
    <>
      <div className="hero-orbs" aria-hidden>
        <div className="hero-orb" />
        <div className="hero-orb" />
        <div className="hero-orb" />
        <div className="hero-orb" />
        <div className="hero-orb" />
      </div>
      <div className="hero-wheat-field" aria-hidden>
        {grains.map((g, i) => (
          <div
            key={i}
            className="hero-wheat-grain"
            style={{
              left: g.left,
              animationDelay: g.delay,
              animationDuration: g.duration,
              ["--drift" as string]: g.drift,
              ["--rot" as string]: g.rot,
              ["--s" as string]: g.scale,
            }}
          >
            {WHEAT_SVG}
          </div>
        ))}
      </div>
    </>
  );
}

export function HeroCreamBackground() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? 8 : 20;
  const colours = ["#D4920A", "#E8B830", "#C88400", "#D8C898", "#F0C870", "#A87008"];

  const crumbs = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        size: rand(4, 18),
        color: colours[Math.floor(Math.random() * colours.length)],
        left: `${rand(0, 100)}%`,
        top: `${rand(20, 90)}%`,
        delay: `${rand(0, 8)}s`,
        duration: `${rand(8, 20)}s`,
        floatY: `${rand(-90, -30)}px`,
        floatX: `${rand(-40, 40)}px`,
        rot: `${rand(-180, 180)}deg`,
        opacity: rand(0.55, 0.9),
        blur: !isMobile && Math.random() > 0.5 ? `blur(${rand(0, 2)}px)` : "none",
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count]
  );

  return (
    <>
      <div className="hero2-glow" aria-hidden />
      <div className="hero-crumbs" aria-hidden>
        {crumbs.map((c, i) => (
          <span
            key={i}
            className="hero-crumb"
            style={{
              width: c.size,
              height: c.size,
              background: c.color,
              left: c.left,
              top: c.top,
              animationDelay: c.delay,
              animationDuration: c.duration,
              filter: c.blur,
              ["--fy" as string]: c.floatY,
              ["--fx" as string]: c.floatX,
              ["--rot" as string]: c.rot,
              ["--op" as string]: c.opacity,
            }}
          />
        ))}
      </div>
    </>
  );
}
