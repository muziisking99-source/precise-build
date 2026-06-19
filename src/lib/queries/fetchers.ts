import { SINGLE_RANGES, BULK_PRODUCTS } from "@/data/products";
import {
  DEFAULT_HERO_PANELS,
  resolveHeroPanelsFromDb,
  type HeroPanelRow,
} from "@/data/heroDefaults";
import { supabase } from "@/integrations/supabase/client";
import type { RangeCharacter } from "@/lib/rangeCharacter";

export type RangeLink = { slug: string; name: string };

export const FALLBACK_SINGLE_RANGES: RangeLink[] = SINGLE_RANGES.map((r) => ({
  slug: r.key,
  name: r.name,
}));

export type HomeRangeRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  image_url: string | null;
};

export type CharacterRow = {
  id: string;
  name: string;
  range: string | null;
  description: string | null;
  pill_text: string | null;
  image_url: string | null;
};

export type TestimonialRow = {
  id: string;
  quote: string;
  name: string;
  location: string | null;
};

export type CategoryHeroImages = { single: string | null; bulk: string | null };

export type DbProduct = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  pill_text: string | null;
  is_visible: boolean;
  sort_order: number;
};

export type DbRange = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  products: DbProduct[];
};

export type BulkItem = { name: string; image_url: string | null; color: string };

export function isBulkRange(slug: string, category?: string | null) {
  return slug === "bulk" || category === "bulk";
}

export function parseRibbonItems(value?: string | null): string[] {
  if (!value) return [];
  return value.split(/\s*·\s*|\s*\|\s*|,\s*/).filter(Boolean);
}

export async function fetchSiteSettings(): Promise<Record<string, string>> {
  const { data } = await supabase.from("site_settings").select("key, value");
  const next: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string | null }) => {
    if (row.value) next[row.key] = row.value;
  });
  return next;
}

export async function fetchHeroPanels(): Promise<HeroPanelRow[]> {
  const { data } = await supabase.from("hero_panels").select("*").order("panel_number");
  if (!data?.length) {
    return DEFAULT_HERO_PANELS.map((p) => ({ ...p }));
  }
  return resolveHeroPanelsFromDb(data as HeroPanelRow[]);
}

export async function fetchHomeRanges(): Promise<HomeRangeRow[]> {
  const { data } = await supabase
    .from("product_ranges")
    .select("id, slug, name, description, sort_order, products(image_url)")
    .order("sort_order");

  if (!data?.length) return [];

  return (data as any[]).map((r) => {
    const products = (r.products ?? []) as { image_url: string | null }[];
    const firstImg = products.find((p) => p.image_url)?.image_url ?? null;
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
      sort_order: r.sort_order,
      image_url: firstImg,
    };
  });
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

export async function fetchVisibleCharacters(): Promise<CharacterRow[]> {
  const { data } = await supabase
    .from("characters")
    .select("id, name, range, description, pill_text, image_url")
    .eq("is_visible", true)
    .order("sort_order");
  return (data ?? []) as CharacterRow[];
}

export async function fetchRangeCharacters(): Promise<RangeCharacter[]> {
  const { data } = await supabase
    .from("characters")
    .select("name, range, image_url")
    .eq("is_visible", true)
    .order("sort_order");
  return (data ?? []) as RangeCharacter[];
}

export async function fetchVisibleTestimonials(): Promise<TestimonialRow[]> {
  const { data } = await supabase
    .from("testimonials")
    .select("id, quote, name, location")
    .eq("is_visible", true)
    .order("sort_order")
    .limit(6);
  return (data ?? []) as TestimonialRow[];
}

export async function fetchCategoryHeroImages(): Promise<CategoryHeroImages> {
  const { data } = await supabase
    .from("products")
    .select("image_url, product_ranges!inner(category)")
    .not("image_url", "is", null)
    .limit(50);

  const next: CategoryHeroImages = { single: null, bulk: null };
  (data ?? []).forEach((r: any) => {
    const cat = r.product_ranges?.category;
    if (cat === "single" && !next.single) next.single = r.image_url;
    if (cat === "bulk" && !next.bulk) next.bulk = r.image_url;
  });
  return next;
}

export async function fetchSingleCatalog(): Promise<DbRange[]> {
  const { data } = await supabase
    .from("product_ranges")
    .select("id, slug, name, description, sort_order, products(*)")
    .order("sort_order");

  if (!data) return [];

  return (data as DbRange[])
    .filter((r) => r.slug !== "bulk")
    .map((r) => ({
      ...r,
      products: (r.products ?? [])
        .filter((p) => p.is_visible)
        .sort((a, b) => a.sort_order - b.sort_order),
    }))
    .filter((r) => r.products.length > 0);
}

export async function fetchBulkProducts(): Promise<BulkItem[]> {
  const { data: range } = await supabase
    .from("product_ranges")
    .select("id")
    .eq("slug", "bulk")
    .maybeSingle();

  if (!range) return [];

  const { data: ps } = await supabase
    .from("products")
    .select("id, name, image_url, is_visible, sort_order")
    .eq("range_id", (range as { id: string }).id)
    .eq("is_visible", true)
    .order("sort_order");

  if (!ps?.length) return [];

  return (ps as DbProduct[]).map((p, i) => {
    const fb = BULK_PRODUCTS[i % BULK_PRODUCTS.length];
    return { name: p.name, image_url: p.image_url, color: fb?.color ?? "#C59B6D" };
  });
}