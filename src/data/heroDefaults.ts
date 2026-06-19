export type HeroPanelRow = {
  id?: string;
  panel_number: number;
  heading_1: string | null;
  heading_2: string | null;
  heading_3: string | null;
  heading_4: string | null;
  subtext: string | null;
  cta_1_text: string | null;
  cta_2_text: string | null;
  badge_text: string | null;
  card_1_label: string | null;
  card_2_label: string | null;
  card_3_label: string | null;
  image_url: string | null;
  is_active: boolean;
};

export const DEFAULT_HERO_PANELS: Omit<HeroPanelRow, "id">[] = [
  {
    panel_number: 1,
    badge_text: "Proudly South African · Est. 1998",
    heading_1: "Delight",
    heading_2: "In every",
    heading_3: "Bite.",
    heading_4: null,
    subtext: "From Lenasia to the nation — quality at honest prices, baked since 1998.",
    cta_1_text: null,
    cta_2_text: "Our Story →",
    card_1_label: null,
    card_2_label: null,
    card_3_label: null,
    image_url: null,
    is_active: true,
  },
  {
    panel_number: 2,
    badge_text: "11 Ranges · One Nation",
    heading_1: "11 Ranges.",
    heading_2: "One Nation.",
    heading_3: null,
    heading_4: null,
    subtext: "Glucose Energy, Just Ginger, Luv-A-Lot, All-Star, Joker and more — baked in Lenasia, loved in every province.",
    cta_1_text: null,
    cta_2_text: null,
    card_1_label: null,
    card_2_label: null,
    card_3_label: null,
    image_url: null,
    is_active: true,
  },
];

export const HERO_PANEL_LABELS = ["Brand Hero", "Products Hero"] as const;

/** Old Lovable seed / pre-redesign copy — should not override current defaults. */
export function isLegacyHeroPanel(p: HeroPanelRow): boolean {
  const text = [p.badge_text, p.heading_1, p.heading_2, p.heading_3, p.heading_4, p.subtext]
    .filter(Boolean)
    .join(" ");

  if (p.panel_number === 1) {
    if (/^Delight\.?$/i.test(p.heading_1?.trim() ?? "") && /In every/i.test(p.heading_2 ?? "")) {
      return false;
    }
    return /Lekker|For Every SA|SA Family|Biscuits For Every/i.test(text);
  }

  if (p.panel_number === 2) {
    if (/11 Ranges/i.test(text)) return false;
    return /\bNine\b|9 RANGES|Beloved|30\+ PRODUCTS|Nine Ranges/i.test(text);
  }

  return false;
}

export function resolveHeroPanelsFromDb(rows: HeroPanelRow[]): HeroPanelRow[] {
  return [
    resolveHeroPanel(rows.find((p) => p.panel_number === 1), 1),
    resolveHeroPanel(rows.find((p) => p.panel_number === 2), 2),
  ];
}

export function resolveHeroPanel(db: HeroPanelRow | undefined, panelNumber: 1 | 2): HeroPanelRow {
  const defaults = { ...DEFAULT_HERO_PANELS[panelNumber - 1] };
  if (!db || isLegacyHeroPanel(db)) {
    return { ...defaults, id: db?.id };
  }
  return { ...defaults, ...db, panel_number: panelNumber };
}

export function panelByNumber(panels: HeroPanelRow[], n: 1 | 2): HeroPanelRow {
  const db = panels.find((p) => p.panel_number === n);
  return resolveHeroPanel(db, n);
}

export function panelsNeedLegacySync(rows: HeroPanelRow[]): HeroPanelRow[] {
  return rows.filter((r) => r.id && (r.panel_number === 1 || r.panel_number === 2) && isLegacyHeroPanel(r));
}

export function legacySyncPayload(p: HeroPanelRow): Omit<HeroPanelRow, "id"> {
  const def = DEFAULT_HERO_PANELS.find((d) => d.panel_number === p.panel_number);
  if (!def) return p;
  return { ...def };
}
