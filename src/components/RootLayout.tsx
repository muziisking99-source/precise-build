"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { Cursor } from "./Effects";
import { Footer, Nav } from "./Layout";
import { AnimatedOutlet } from "./motion/AnimatedOutlet";
import { siteSettingsQueryOptions, singleRangesQueryOptions } from "@/lib/queries/options";

export function RootLayout() {
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    void queryClient.prefetchQuery(siteSettingsQueryOptions());
    void queryClient.prefetchQuery(singleRangesQueryOptions());
  }, [isAdmin, queryClient]);

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
