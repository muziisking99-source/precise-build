"use client";

import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { Outlet, useMatch, useMatches } from "@tanstack/react-router";
import { prefersReducedMotion } from "./transitions";
import { useCategoryTransition } from "./CategoryTransition";

const productFadeTransition = { duration: 0.32, ease: [0.4, 0, 0.2, 1] as const };

function ProductsPageTransition({ children }: { children: React.ReactNode }) {
  const reduced = prefersReducedMotion();
  const isPresent = useIsPresent();
  const { active, phase } = useCategoryTransition();
  const fromCategory = active || phase === "hold" || phase === "exit";

  if (reduced) {
    return <main className="page-transition-root products-transition-root">{children}</main>;
  }

  if (fromCategory) {
    return (
      <motion.main
        className="page-transition-root products-transition-root"
        aria-hidden={!isPresent}
        initial={false}
        animate={{ opacity: isPresent ? 1 : 0 }}
        transition={productFadeTransition}
        style={isPresent ? undefined : { position: "absolute", inset: 0, width: "100%", pointerEvents: "none" }}
      >
        {children}
      </motion.main>
    );
  }

  return (
    <motion.main
      className="page-transition-root products-transition-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={productFadeTransition}
      style={isPresent ? { position: "relative", zIndex: 1 } : { position: "absolute", inset: 0, width: "100%", zIndex: 0, pointerEvents: "none" }}
    >
      {children}
    </motion.main>
  );
}

export function ProductsAnimatedOutlet() {
  const matches = useMatches();
  const match = useMatch({ strict: false });
  const nextMatchIndex = matches.findIndex((d) => d.id === match.id) + 1;
  const nextMatch = matches[nextMatchIndex];
  const key = nextMatch?.id ?? match.id;
  const reduced = prefersReducedMotion();

  if (reduced) {
    return <Outlet />;
  }

  return (
    <div className="products-transition-shell">
      <AnimatePresence mode="sync" initial={false}>
        <ProductsPageTransition key={key}>
          <Outlet />
        </ProductsPageTransition>
      </AnimatePresence>
    </div>
  );
}
