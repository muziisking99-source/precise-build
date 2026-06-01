"use client";

import { Cursor } from "./Effects";
import { Footer, Nav } from "./Layout";
import { AnimatedOutlet } from "./motion/AnimatedOutlet";

export function RootLayout() {
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
