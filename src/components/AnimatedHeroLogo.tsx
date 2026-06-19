"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion, spring } from "./motion/transitions";

type AnimatedHeroLogoProps = {
  height?: number;
  className?: string;
};

const logoSpring = { ...spring, stiffness: 52, damping: 14 };

const stripesVariants = {
  hidden: { opacity: 0, y: -120, scaleY: 0.5 },
  visible: { opacity: 1, y: 0, scaleY: 1 },
};

const elementsVariants = {
  hidden: { opacity: 0, x: -100, scale: 0.78 },
  visible: { opacity: 1, x: 0, scale: 1 },
};

export function AnimatedHeroLogo({ height = 437, className = "" }: AnimatedHeroLogoProps) {
  const reduced = prefersReducedMotion();
  const [play, setPlay] = useState(reduced);
  const aspect = 1920 / 1610;
  const width = Math.round(height * aspect);

  useEffect(() => {
    if (reduced) return;
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  if (reduced) {
    return (
      <div
        className={`animated-hero-logo ${className}`.trim()}
        style={{ width, height }}
        role="img"
        aria-label="Golden Fresh Biscuits"
      >
        <img
          className="animated-hero-logo__layer animated-hero-logo__stripes"
          src="/brand/logo-layer-stripes.png"
          alt=""
          width={width}
          height={height}
          draggable={false}
        />
        <img
          className="animated-hero-logo__layer animated-hero-logo__elements"
          src="/brand/logo-layer-text.png"
          alt=""
          width={width}
          height={height}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className={`animated-hero-logo ${className}`.trim()}
      style={{ width, height }}
      role="img"
      aria-label="Golden Fresh Biscuits"
    >
      <motion.img
        className="animated-hero-logo__layer animated-hero-logo__stripes"
        src="/brand/logo-layer-stripes.png"
        alt=""
        width={width}
        height={height}
        draggable={false}
        style={{ transformOrigin: "50% 20%" }}
        variants={stripesVariants}
        initial="hidden"
        animate={play ? "visible" : "hidden"}
        transition={{ ...logoSpring, delay: 0.3 }}
      />
      <motion.img
        className="animated-hero-logo__layer animated-hero-logo__elements"
        src="/brand/logo-layer-text.png"
        alt=""
        width={width}
        height={height}
        draggable={false}
        style={{ transformOrigin: "50% 50%" }}
        variants={elementsVariants}
        initial="hidden"
        animate={play ? "visible" : "hidden"}
        transition={{ ...logoSpring, delay: 0.95 }}
      />
    </div>
  );
}
