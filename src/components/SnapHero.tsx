import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { SupaDupa, GingerMan, LuvALotGirl, AllStarFootballer, JokerHat } from "./Characters";

type PanelKind = "navy" | "cream";

function Panel({
  kind,
  index,
  registerRef,
  children,
  hint = true,
}: {
  kind: PanelKind;
  index: number;
  registerRef: (i: number, el: HTMLElement | null) => void;
  children: React.ReactNode;
  hint?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Scrubbed text reveal — opacity / translateY tied to scroll position
  const y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [60, 0, 0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  // Ken Burns background scale
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <section
      ref={(el) => {
        ref.current = el;
        registerRef(index, el);
      }}
      className={`snap-panel snap-panel--${kind}`}
      data-panel-index={index}
    >
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          scale: bgScale,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <motion.div className="snap-inner" style={{ y, opacity }}>
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
        {["Home", "Products", "Characters"].map((label, i) => (
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

      {/* PANEL 1 — Brand Hero */}
      <Panel kind="navy" index={0} registerRef={register}>
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
        <p className="snap-sub">
          From Lenasia to the nation — quality at honest prices, baked since 1998.
        </p>
        <div className="snap-ctas">
          <Link to="/products" className="snap-cta-primary">Shop Products</Link>
          <Link to="/about" className="snap-cta-ghost">Our Story →</Link>
        </div>
      </Panel>

      {/* PANEL 2 — Products Hero */}
      <Panel kind="cream" index={1} registerRef={register}>
        <div className="snap-badge" style={{ color: "var(--red)" }}>
          <span className="snap-badge-dot" style={{ background: "var(--red)" }} />
          Nine Ranges · One Nation
        </div>
        <h1 className="snap-h1" style={{ color: "var(--ink)" }}>
          Nine Ranges.
          <br />
          <span style={{ color: "var(--red)" }}>One Nation.</span>
        </h1>
        <p className="snap-sub">
          Glucose Energy, Just Ginger, Luv-A-Lot, All-Star, Joker and more — baked in Lenasia, loved in every province.
        </p>
        <div className="snap-ctas">
          <Link to="/products" className="snap-cta-primary">View All Products →</Link>
        </div>
      </Panel>

      {/* PANEL 3 — Characters Intro */}
      <Panel kind="navy" index={2} registerRef={register} hint={false}>
        <div className="snap-badge">
          <span className="snap-badge-dot" />
          The Biscuit Gang
        </div>
        <h1 className="snap-h1">
          <span className="white">Meet the</span>
          <br />
          <span className="gold">Biscuit Gang.</span>
        </h1>
        <p className="snap-sub">
          Collect all five. Find a sticker in every pack.
        </p>
        <div className="char-spread">
          <div><SupaDupa size={140} /></div>
          <div><GingerMan size={130} /></div>
          <div><LuvALotGirl size={160} /></div>
          <div><AllStarFootballer size={130} /></div>
          <div><JokerHat size={140} /></div>
        </div>
        <div className="snap-ctas">
          <Link to="/products" className="snap-cta-ghost" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
            See the Gang →
          </Link>
        </div>
      </Panel>
    </div>
  );
}
