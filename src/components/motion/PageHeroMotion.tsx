"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { prefersReducedMotion, spring } from "./transitions";

export function PageHeroMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = prefersReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}
