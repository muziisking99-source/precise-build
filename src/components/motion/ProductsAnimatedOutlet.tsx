"use client";

import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { Outlet, useMatch, useMatches } from "@tanstack/react-router";
import { prefersReducedMotion, spring } from "./transitions";
import { useCategoryTransition } from "./CategoryTransition";

const defaultEnter = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

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
        className={`page-transition-root products-transition-root products-transition-root--revealing${isPresent ? "" : " products-transition-root--leaving"}`}
        aria-hidden={!isPresent}
        initial={false}
        animate={{ opacity: isPresent ? 1 : 0 }}
        transition={{ duration: 0 }}
      >
        {children}
      </motion.main>
    );
  }

  return (
    <motion.main
      className="page-transition-root products-transition-root"
      initial={defaultEnter.initial}
      animate={defaultEnter.animate}
      exit={defaultEnter.exit}
      transition={spring}
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
  const { active } = useCategoryTransition();

  if (reduced) {
    return <Outlet />;
  }

  return (
    <AnimatePresence mode={active ? "sync" : "wait"} initial={false}>
      <ProductsPageTransition key={key}>
        <Outlet />
      </ProductsPageTransition>
    </AnimatePresence>
  );
}
