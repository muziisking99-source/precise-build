import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HeroNavyBackground, HeroCreamBackground } from "./HeroBackgrounds";
import { Logo } from "./Logo";
import { prefersReducedMotion, spring } from "./motion/transitions";

type PanelKind = "navy" | "cream";

const contentEnter = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Panel({
  kind,
  index,
  registerRef,
  background,
  children,
  innerClassName = "",
  hint = true,
}: {
  kind: PanelKind;
  index: number;
  registerRef: (i: number, el: HTMLElement | null) => void;
  background: React.ReactNode;
  children: React.ReactNode;
  innerClassName?: string;
  hint?: boolean;
}) {
  const reduced = prefersReducedMotion();
  const isFirstPanel = index === 0;

  return (
    <section
      ref={(el) => registerRef(index, el)}
      className={`snap-panel snap-panel--${kind}`}
      data-panel-index={index}
    >
      <div className="snap-panel-bg" aria-hidden>
        {background}
      </div>
      <motion.div
        className={`snap-inner ${innerClassName}`.trim()}
        variants={contentEnter}
        initial={reduced ? "visible" : "hidden"}
        {...(isFirstPanel
          ? { animate: "visible" }
          : {
              whileInView: "visible",
              viewport: { once: true, amount: 0.2 },
            })}
        transition={{ ...spring, delay: isFirstPanel ? 0.08 : 0 }}
      >
        {children}
      </motion.div>
      {hint && <div className="snap-scroll-hint">Scroll</div>}
    </section>
  );
}

export function SnapHero() {
  const panelsRef = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);

  const register = (i: number, el: HTMLElement | null) => {
    panelsRef.current[i] = el;
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = Number((entry.target as HTMLElement).dataset.panelIndex);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { threshold: [0.5] }
    );
    panelsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    panelsRef.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="snap-wrap">
      <nav className="dot-nav" aria-label="Section navigation">
        {["Home", "Products"].map((label, i) => (
          <button
            key={label}
            type="button"
            className={active === i ? "active" : ""}
            aria-label={label}
            title={label}
            onClick={() => goTo(i)}
          />
        ))}
      </nav>

      <Panel
        kind="navy"
        index={0}
        registerRef={register}
        background={<HeroNavyBackground />}
        innerClassName="snap-inner--split"
      >
        <div className="snap-copy">
          <div className="snap-badge">
            <span className="snap-badge-dot" />
            Proudly South African · Est. 1998
          </div>
          <h1 className="snap-h1">
            <span className="white">Lekker</span>
            <br />
            <span className="gold">Biscuits</span>
            <br />
            <span className="white">For Every</span>
            <br />
            <span className="white">SA </span>
            <span className="red">Family.</span>
          </h1>
          <p className="snap-tagline">Delight in every Bite</p>
          <div className="snap-logo-mobile">
            <Logo height={182} className="snap-logo-img" />
          </div>
          <p className="snap-sub">
            From Lenasia to the nation — quality at honest prices, baked since 1998.
          </p>
          <div className="snap-ctas">
            <Link to="/about" className="snap-cta-ghost">Our Story →</Link>
          </div>
        </div>
        <div className="snap-logo-desktop">
          <Logo height={364} className="snap-logo-img" />
        </div>
      </Panel>

      <Panel
        kind="cream"
        index={1}
        registerRef={register}
        background={<HeroCreamBackground />}
        hint={false}
      >
        <div className="snap-badge" style={{ color: "var(--red)" }}>
          <span className="snap-badge-dot" style={{ background: "var(--red)" }} />
          11 Ranges · One Nation
        </div>
        <h1 className="snap-h1" style={{ color: "var(--ink)" }}>
          11 Ranges.
          <br />
          <span style={{ color: "var(--red)" }}>One Nation.</span>
        </h1>
        <p className="snap-sub">
          Glucose Energy, Just Ginger, Luv-A-Lot, All-Star, Joker and more — baked in Lenasia, loved in every province.
        </p>
      </Panel>
    </div>
  );
}
