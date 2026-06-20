"use client";

import { useEffect, useState } from "react";
import { productPackImageUrl } from "@/lib/carouselImageUrl";
import { createPortal } from "react-dom";
import { ZoomIn, X } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export function ProductImageLightbox({ src, alt, className = "product-pack-img" }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="prod-image-enlarge"
        onClick={() => setOpen(true)}
        aria-label={`View larger image of ${alt}`}
      >
        <img src={productPackImageUrl(src)} alt={alt} className={className} loading="lazy" decoding="async" />
        <span className="prod-image-enlarge-hint" aria-hidden>
          <ZoomIn size={18} strokeWidth={2} />
        </span>
      </button>

      {open && mounted
        ? createPortal(
            <div
              className="product-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              onClick={() => setOpen(false)}
            >
              <button
                type="button"
                className="product-lightbox-close"
                onClick={() => setOpen(false)}
                aria-label="Close enlarged image"
              >
                <X size={22} strokeWidth={2} />
              </button>
              <div className="product-lightbox-stage" onClick={(e) => e.stopPropagation()}>
                <img src={src} alt={alt} className="product-lightbox-img" />
                <p className="product-lightbox-caption">{alt}</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
