"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "./motion/transitions";

type CategoryImageCarouselProps = {
  images: string[];
  alt: string;
  intervalMs?: number;
};

export function CategoryImageCarousel({
  images,
  alt,
  intervalMs = 500,
}: CategoryImageCarouselProps) {
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    setIndex(0);
  }, [slides.join("|")]);

  useEffect(() => {
    if (reduced || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, reduced]);

  if (!slides.length) {
    return <span className="category-card-fallback" aria-hidden />;
  }

  if (slides.length === 1 || reduced) {
    return <img src={slides[0]} alt={alt} />;
  }

  return (
    <div className="category-carousel" aria-live="polite">
      {slides.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={i === index ? alt : ""}
          className={i === index ? "is-active" : undefined}
          aria-hidden={i !== index}
        />
      ))}
    </div>
  );
}
