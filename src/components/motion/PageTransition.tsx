"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { pageTransition, prefersReducedMotion } from "./transitions";

export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = prefersReducedMotion();
  if (reduced) {
    return <main className="page-transition-root">{children}</main>;
  }
  return (
    <motion.main
      className="page-transition-root"
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
    >
      {children}
    </motion.main>
  );
}
