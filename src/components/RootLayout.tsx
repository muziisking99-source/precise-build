"use client";

import { useRouterState } from "@tanstack/react-router";
import { Cursor } from "./Effects";
import { Footer, Nav } from "./Layout";
import { AnimatedOutlet } from "./motion/AnimatedOutlet";

export function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <AnimatedOutlet />;
  }

  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <Cursor />
      <Nav />
      <AnimatedOutlet />
      <Footer />
    </>
  );
}
