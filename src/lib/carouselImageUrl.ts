/** Max display width for category card carousel (~340px slot × 2 for retina). */
const CAROUSEL_WIDTH = 640;
const PRODUCT_PACK_WIDTH = 720;
const MASCOT_WIDTH = 256;
const RANGE_CARD_WIDTH = 720;
const QUALITY = 78;

function buildOptimizedUrl(src: string, width: number, quality = QUALITY): string {
  if (!src) return src;

  try {
    const url = new URL(src);
    const objectMatch = url.pathname.match(
      /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/,
    );
    if (!objectMatch) return src;

    const [, bucket, objectPath] = objectMatch;
    url.pathname = `/storage/v1/render/image/public/${bucket}/${objectPath}`;
    url.search = new URLSearchParams({
      width: String(width),
      quality: String(quality),
      resize: "contain",
    }).toString();

    return url.toString();
  } catch {
    return src;
  }
}

/**
 * Serve a smaller Supabase image when transforms are enabled.
 * Falls back to the original URL if the source is not from our storage.
 */
export function carouselImageUrl(src: string): string {
  return buildOptimizedUrl(src, CAROUSEL_WIDTH);
}

export function productPackImageUrl(src: string): string {
  return buildOptimizedUrl(src, PRODUCT_PACK_WIDTH);
}

export function mascotImageUrl(src: string): string {
  return buildOptimizedUrl(src, MASCOT_WIDTH);
}

export function rangeCardImageUrl(src: string): string {
  return buildOptimizedUrl(src, RANGE_CARD_WIDTH);
}

export function preloadImages(urls: string[], transform: (url: string) => string = carouselImageUrl) {
  urls.forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.src = transform(src);
  });
}
