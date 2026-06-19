/** Default zoom for pack shots that need to read larger on card (e.g. All-Star). */
export const DEFAULT_PACK_ENLARGE_SCALE = 1.25;

const RANGE_PACK_SCALE: Record<string, number> = {
  allstar: DEFAULT_PACK_ENLARGE_SCALE,
};

/** Display scale for product pack images on the public site, by range slug. */
export function productPackImageScale(rangeSlug: string): number {
  return RANGE_PACK_SCALE[rangeSlug] ?? 1;
}
