"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, prefersReducedMotion, spring } from "./transitions";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
};

export function MotionReveal({ children, className = "", delay = 0, style }: MotionRevealProps) {
  const reduced = prefersReducedMotion();

  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={fadeUp.initial}
      whileInView={fadeUp.whileInView}
      viewport={fadeUp.viewport}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}
