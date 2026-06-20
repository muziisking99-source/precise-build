"use client";

import { useEffect, useState } from "react";
import { carouselImageUrl } from "@/lib/carouselImageUrl";
import { prefersReducedMotion } from "./motion/transitions";

type CategoryImageCarouselProps = {
  images: string[];
  alt: string;
  intervalMs?: number;
  priority?: boolean;
};

function preloadOne(src: string) {
  return new Promise<string>((resolve) => {
    const optimized = carouselImageUrl(src);
    const img = new Image();
    img.decoding = "async";
    const finish = (url: string) => resolve(url);
    img.onload = () => finish(optimized);
    img.onerror = () => finish(src);
    img.src = optimized;
  });
}

export function CategoryImageCarousel({
  images,
  alt,
  intervalMs = 1000,
  priority = false,
}: CategoryImageCarouselProps) {
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    setIndex(0);
    setReady(false);
    setDisplaySrc(null);
  }, [slides.join("|")]);

  useEffect(() => {
    if (!slides.length) return;

    let cancelled = false;

    void (async () => {
      const firstUrl = await preloadOne(slides[0]);
      if (cancelled) return;
      setDisplaySrc(firstUrl);
      setReady(true);

      const rest = await Promise.all(slides.slice(1).map(preloadOne));
      if (cancelled) return;
      void rest;
    })();

    return () => {
      cancelled = true;
    };
  }, [slides.join("|")]);

  useEffect(() => {
    if (!ready || reduced || slides.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, reduced, ready]);

  useEffect(() => {
    if (!ready || slides.length <= 1) return;

    let cancelled = false;
    void preloadOne(slides[index]).then((url) => {
      if (!cancelled) setDisplaySrc(url);
    });

    return () => {
      cancelled = true;
    };
  }, [index, ready, slides]);

  if (!slides.length) {
    return <span className="category-card-fallback" aria-hidden />;
  }

  return (
    <div className={`category-carousel${ready ? " is-ready" : ""}`} aria-live="polite">
      {!ready && <span className="category-carousel-shimmer" aria-hidden />}
      {ready && displaySrc && (
        <img
          src={displaySrc}
          alt={alt}
          className="is-active"
          loading="eager"
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onError={() => {
            const original = slides[index];
            if (displaySrc !== original) setDisplaySrc(original);
          }}
        />
      )}
    </div>
  );
}
