import { useMemo } from "react";

const WHEAT_SVG = (
  <svg viewBox="0 0 24 48" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden>
    <line x1="12" y1="48" x2="12" y2="4" stroke="#D4920A" strokeWidth="1.5" opacity="0.75" />
    <ellipse cx="12" cy="8" rx="4" ry="7" fill="#E8B830" opacity="0.65" />
    <ellipse cx="6" cy="16" rx="3.5" ry="6" fill="#D4920A" opacity="0.5" transform="rotate(-30 6 16)" />
    <ellipse cx="18" cy="16" rx="3.5" ry="6" fill="#D4920A" opacity="0.5" transform="rotate(30 18 16)" />
    <ellipse cx="5" cy="26" rx="3" ry="5.5" fill="#E8B830" opacity="0.4" transform="rotate(-25 5 26)" />
    <ellipse cx="19" cy="26" rx="3" ry="5.5" fill="#E8B830" opacity="0.4" transform="rotate(25 19 26)" />
  </svg>
);

const WHEAT_SVG_ALT = (
  <svg viewBox="0 0 24 48" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden style={{ transform: "scaleX(-1)" }}>
    <line x1="12" y1="48" x2="12" y2="4" stroke="#E8B830" strokeWidth="1.5" opacity="0.7" />
    <ellipse cx="12" cy="8" rx="4" ry="7" fill="#D4920A" opacity="0.6" />
    <ellipse cx="7" cy="18" rx="3.5" ry="6" fill="#C88400" opacity="0.45" transform="rotate(-25 7 18)" />
    <ellipse cx="17" cy="18" rx="3.5" ry="6" fill="#C88400" opacity="0.45" transform="rotate(25 17 18)" />
    <ellipse cx="6" cy="28" rx="3" ry="5" fill="#E8B830" opacity="0.38" transform="rotate(-20 6 28)" />
    <ellipse cx="18" cy="28" rx="3" ry="5" fill="#D4920A" opacity="0.38" transform="rotate(20 18 28)" />
  </svg>
);

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function HeroNavyBackground() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? 10 : 26;

  const grains = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${rand(-5, 105)}%`,
        delay: `${rand(0, 14)}s`,
        duration: `${rand(10, 20)}s`,
        scale: rand(0.7, 1.8),
        drift: `${rand(-80, 80)}px`,
        rot: `${rand(-25, 25)}deg`,
        variant: i % 2,
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
        <div className="hero-orb hero-orb--extra" />
        <div className="hero-orb hero-orb--extra" />
        <div className="hero-orb hero-orb--extra" />
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
            {g.variant === 0 ? WHEAT_SVG : WHEAT_SVG_ALT}
          </div>
        ))}
      </div>
    </>
  );
}

export function HeroCreamBackground() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? 12 : 28;
  const colours = ["#D4920A", "#E8B830", "#C88400", "#D8C898", "#F0C870", "#A87008"];

  const crumbs = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        size: rand(4, 20),
        color: colours[Math.floor(Math.random() * colours.length)],
        left: `${rand(-3, 103)}%`,
        top: `${rand(15, 92)}%`,
        delay: `${rand(0, 8)}s`,
        duration: `${rand(8, 20)}s`,
        floatY: `${rand(-100, -30)}px`,
        floatX: `${rand(-50, 50)}px`,
        rot: `${rand(-180, 180)}deg`,
        opacity: rand(0.65, 0.95),
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
