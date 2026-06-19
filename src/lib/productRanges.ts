import { SINGLE_RANGES } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";

export type RangeLink = { slug: string; name: string };

export const FALLBACK_SINGLE_RANGES: RangeLink[] = SINGLE_RANGES.map((r) => ({
  slug: r.key,
  name: r.name,
}));

export function isBulkRange(slug: string, category?: string | null) {
  return slug === "bulk" || category === "bulk";
}

export async function fetchSingleProductRanges(): Promise<RangeLink[]> {
  const { data } = await supabase
    .from("product_ranges")
    .select("slug, name, category, sort_order")
    .order("sort_order");

  if (!data?.length) return FALLBACK_SINGLE_RANGES;

  const ranges = (data as { slug: string; name: string; category?: string | null }[])
    .filter((r) => !isBulkRange(r.slug, r.category))
    .map((r) => ({ slug: r.slug, name: r.name }));

  return ranges.length ? ranges : FALLBACK_SINGLE_RANGES;
}
