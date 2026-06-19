import { useMemo } from "react";

const BISCUIT_ROUND = (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="24" cy="26" r="19" fill="#B8844A" opacity="0.22" />
    <circle cx="24" cy="24" r="18" fill="#E8C07A" stroke="#C59B6D" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="14" fill="none" stroke="#D4920A" strokeWidth="0.8" opacity="0.45" />
    <circle cx="17" cy="19" r="1.4" fill="#A87008" opacity="0.35" />
    <circle cx="24" cy="16" r="1.4" fill="#A87008" opacity="0.35" />
    <circle cx="31" cy="19" r="1.4" fill="#A87008" opacity="0.35" />
    <circle cx="19" cy="27" r="1.4" fill="#A87008" opacity="0.35" />
    <circle cx="29" cy="27" r="1.4" fill="#A87008" opacity="0.35" />
    <circle cx="24" cy="30" r="1.4" fill="#A87008" opacity="0.35" />
  </svg>
);

const BISCUIT_GLOUCOSE = (
  <svg viewBox="0 0 56 36" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="4" y="8" width="48" height="24" rx="5" fill="#B8844A" opacity="0.2" />
    <rect x="4" y="6" width="48" height="24" rx="5" fill="#F0D49A" stroke="#C59B6D" strokeWidth="1.5" />
    <rect x="8" y="10" width="40" height="16" rx="3" fill="none" stroke="#D4920A" strokeWidth="0.8" opacity="0.4" />
    <circle cx="18" cy="18" r="2" fill="#D4920A" opacity="0.55" />
    <circle cx="28" cy="18" r="2" fill="#D4920A" opacity="0.55" />
    <circle cx="38" cy="18" r="2" fill="#D4920A" opacity="0.55" />
    <circle cx="23" cy="14" r="1.5" fill="#D4920A" opacity="0.4" />
    <circle cx="33" cy="14" r="1.5" fill="#D4920A" opacity="0.4" />
    <circle cx="23" cy="22" r="1.5" fill="#D4920A" opacity="0.4" />
    <circle cx="33" cy="22" r="1.5" fill="#D4920A" opacity="0.4" />
  </svg>
);

const BISCUIT_MARIE = (
  <svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="5" y="7" width="30" height="36" rx="4" fill="#B8844A" opacity="0.2" />
    <rect x="5" y="5" width="30" height="36" rx="4" fill="#F5E6C8" stroke="#C59B6D" strokeWidth="1.5" />
    <rect x="9" y="9" width="22" height="28" rx="2" fill="none" stroke="#D4920A" strokeWidth="0.8" opacity="0.38" />
    <path d="M9 14 H31 M9 20 H31 M9 26 H31 M9 32 H31" stroke="#D4920A" strokeWidth="0.6" opacity="0.28" />
    <path d="M14 9 V37 M20 9 V37 M26 9 V37" stroke="#D4920A" strokeWidth="0.6" opacity="0.28" />
  </svg>
);

const BISCUIT_VARIANTS = [BISCUIT_ROUND, BISCUIT_GLOUCOSE, BISCUIT_MARIE] as const;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function HeroNavyBackground() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? 22 : 48;

  const biscuits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${rand(-8, 108)}%`,
        delay: `${rand(0, 9)}s`,
        duration: `${rand(9, 18)}s`,
        scale: rand(0.65, 2.1),
        drift: `${rand(-110, 110)}px`,
        rot: `${rand(-40, 40)}deg`,
        tumble: `${rand(-160, 160)}deg`,
        startY: `${rand(0, -68)}vh`,
        variant: i % BISCUIT_VARIANTS.length,
        width: i % 3 === 1 ? rand(40, 54) : i % 3 === 2 ? rand(28, 38) : rand(34, 48),
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
      <div className="hero-biscuit-field" aria-hidden>
        {biscuits.map((b, i) => (
          <div
            key={i}
            className="hero-biscuit"
            style={{
              left: b.left,
              width: b.width,
              animationDelay: b.delay,
              animationDuration: b.duration,
              ["--drift" as string]: b.drift,
              ["--rot" as string]: b.rot,
              ["--tumble" as string]: b.tumble,
              ["--start-y" as string]: b.startY,
              ["--s" as string]: b.scale,
            }}
          >
            {BISCUIT_VARIANTS[b.variant]}
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
