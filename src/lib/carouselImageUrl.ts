/** Max display width for category card carousel (~340px slot × 2 for retina). */
const CAROUSEL_WIDTH = 640;
const CAROUSEL_QUALITY = 78;

/**
 * Serve a smaller Supabase image when transforms are enabled.
 * Falls back to the original URL if the source is not from our storage.
 */
export function carouselImageUrl(src: string): string {
  if (!src) return src;

  try {
    const url = new URL(src);
    const objectMatch = url.pathname.match(
      /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/
    );
    if (!objectMatch) return src;

    const [, bucket, objectPath] = objectMatch;
    url.pathname = `/storage/v1/render/image/public/${bucket}/${objectPath}`;
    url.search = new URLSearchParams({
      width: String(CAROUSEL_WIDTH),
      quality: String(CAROUSEL_QUALITY),
      resize: "contain",
    }).toString();

    return url.toString();
  } catch {
    return src;
  }
}

export function preloadImages(urls: string[]) {
  urls.forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.src = carouselImageUrl(src);
  });
}
