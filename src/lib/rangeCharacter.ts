import { CHARACTERS } from "@/components/Characters";

export type RangeCharacter = {
  name: string;
  range: string | null;
  image_url: string | null;
  Comp?: (typeof CHARACTERS)[number]["Comp"];
};

const SLUG_CHARACTER_KEYS: Record<string, string[]> = {
  glucose: ["supa dupa", "glucose", "energy glucose", "glucose energy"],
  supadupa: ["supa dupa"],
  ginger: ["just ginger", "ginger man", "ginger"],
  luvalot: ["luv-a-lot", "luvalot"],
  allstar: ["all-star", "allstar", "footballer"],
  joker: ["joker"],
  trio: ["trio"],
  marie: ["marie"],
  cream: ["cream"],
};

function norm(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matchesKeys(text: string, keys: string[]) {
  const hay = norm(text);
  return keys.some((key) => {
    const k = norm(key);
    return hay === k || hay.includes(k) || k.includes(hay);
  });
}

export function characterForRange(
  slug: string,
  rangeName: string,
  fromDb: RangeCharacter[] = [],
): RangeCharacter | null {
  const keys = [slug, rangeName, ...(SLUG_CHARACTER_KEYS[slug] ?? [])];

  const dbMatch = fromDb.find(
    (c) => matchesKeys(c.range ?? "", keys) || matchesKeys(c.name, keys),
  );
  if (dbMatch) {
    const fallback = CHARACTERS.find((c) => matchesKeys(c.range, keys) || matchesKeys(c.name, keys));
    return { ...dbMatch, Comp: fallback?.Comp };
  }

  const fallback = CHARACTERS.find((c) => matchesKeys(c.range, keys) || matchesKeys(c.name, keys));
  if (!fallback) return null;

  return {
    name: fallback.name,
    range: fallback.range,
    image_url: null,
    Comp: fallback.Comp,
  };
}
