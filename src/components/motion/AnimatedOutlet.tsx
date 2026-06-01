"use client";

import { AnimatePresence } from "framer-motion";
import { Outlet, useMatch, useMatches } from "@tanstack/react-router";
import { PageTransition } from "./PageTransition";
import { prefersReducedMotion } from "./transitions";

export function AnimatedOutlet() {
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
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={key}>
        <Outlet />
      </PageTransition>
    </AnimatePresence>
  );
}
