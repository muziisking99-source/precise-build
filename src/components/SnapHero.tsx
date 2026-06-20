"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { HeroNavyBackground, HeroCreamBackground } from "./HeroBackgrounds";
import { AnimatedHeroLogo } from "./AnimatedHeroLogo";
import { SiteSectionLoading } from "./SiteSectionLoading";
import { prefersReducedMotion, spring } from "./motion/transitions";
import { panelByNumber, type HeroPanelRow } from "@/data/heroDefaults";
import { heroPanelsQueryOptions } from "@/lib/queries/options";

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
  aside,
  innerClassName = "",
  hint = true,
}: {
  kind: PanelKind;
  index: number;
  registerRef: (i: number, el: HTMLElement | null) => void;
  background: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
  innerClassName?: string;
  hint?: boolean;
}) {
  const reduced = prefersReducedMotion();
  const isFirstPanel = index === 0;
  const [play, setPlay] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  const motionProps = isFirstPanel
    ? { animate: play ? "visible" : "hidden" }
    : {
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2 },
      };

  const inner = (
    <motion.div
      className={aside ? "snap-copy-motion" : `snap-inner ${innerClassName}`.trim()}
      variants={contentEnter}
      initial={reduced ? "visible" : "hidden"}
      {...motionProps}
      transition={{ ...spring, delay: isFirstPanel ? 0.08 : 0 }}
    >
      {children}
    </motion.div>
  );

  return (
    <section
      ref={(el) => registerRef(index, el)}
      className={`snap-panel snap-panel--${kind}`}
      data-panel-index={index}
    >
      <div className="snap-panel-bg" aria-hidden>
        {background}
      </div>
      {aside ? (
        <div className={`snap-inner ${innerClassName}`.trim()}>
          {inner}
          {aside}
        </div>
      ) : (
        inner
      )}
      {hint && <div className="snap-scroll-hint">Scroll</div>}
    </section>
  );
}

function BrandHeading({ p }: { p: HeroPanelRow }) {
  return (
    <h1 className="snap-h1">
      {p.heading_1 && (
        <>
          <span className="gold">{p.heading_1}</span>
          <br />
        </>
      )}
      {p.heading_2 && (
        <>
          <span className="white">{p.heading_2}</span>
          <br />
        </>
      )}
      {p.heading_3 && <span className="red">{p.heading_3}</span>}
      {p.heading_4 && (
        <>
          <br />
          <span className="white">{p.heading_4}</span>
        </>
      )}
    </h1>
  );
}

function ProductsHeading({ p }: { p: HeroPanelRow }) {
  return (
    <h1 className="snap-h1" style={{ color: "var(--ink)" }}>
      {p.heading_1 && (
        <>
          {p.heading_1}
          <br />
        </>
      )}
      {p.heading_2 && <span style={{ color: "var(--red)" }}>{p.heading_2}</span>}
      {p.heading_3 && (
        <>
          <br />
          {p.heading_3}
        </>
      )}
    </h1>
  );
}

export function SnapHero() {
  const panelsRef = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);
  const { data: heroPanels, isPending: heroLoading } = useQuery(heroPanelsQueryOptions());
  const panel1 = panelByNumber(heroPanels ?? [], 1);
  const panel2 = panelByNumber(heroPanels ?? [], 2);
  const showPanel2 = !heroLoading && panel2.is_active !== false;

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
  }, [showPanel2]);

  const goTo = (i: number) => {
    panelsRef.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navLabels = showPanel2 ? ["Home", "Products"] : ["Home"];

  return (
    <div className="snap-wrap">
      <nav className="dot-nav" aria-label="Section navigation">
        {navLabels.map((label, i) => (
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

      {(heroLoading || panel1.is_active !== false) && (
        <Panel
          kind="navy"
          index={0}
          registerRef={register}
          background={<HeroNavyBackground />}
        >
          <div className="snap-copy">
            {heroLoading ? (
              <SiteSectionLoading variant="hero-copy" />
            ) : (
              <>
            {panel1.badge_text && (
              <div className="snap-badge" style={{ color: "var(--red)" }}>
                <span className="snap-badge-dot" style={{ background: "var(--red)" }} />
                {panel1.badge_text}
              </div>
            )}
            <div className="snap-hero-headline-row">
              <BrandHeading p={panel1} />
              <AnimatedHeroLogo matchHeadline />
            </div>
            <div className="snap-logo-mobile">
              <AnimatedHeroLogo height={218} />
            </div>
            {panel1.subtext && <p className="snap-sub">{panel1.subtext}</p>}
            {panel1.cta_2_text && (
              <div className="snap-ctas">
                <Link to="/about" className="snap-cta-ghost">{panel1.cta_2_text}</Link>
              </div>
            )}
              </>
            )}
          </div>
        </Panel>
      )}

      {showPanel2 && (
        <Panel
          kind="cream"
          index={1}
          registerRef={register}
          background={<HeroCreamBackground />}
          hint={false}
        >
          {heroLoading ? (
            <SiteSectionLoading variant="hero-copy" />
          ) : (
            <>
          {panel2.badge_text && (
            <div className="snap-badge" style={{ color: "var(--red)" }}>
              <span className="snap-badge-dot" style={{ background: "var(--red)" }} />
              {panel2.badge_text}
            </div>
          )}
          <ProductsHeading p={panel2} />
          {panel2.subtext && <p className="snap-sub">{panel2.subtext}</p>}
            </>
          )}
        </Panel>
      )}
    </div>
  );
}
