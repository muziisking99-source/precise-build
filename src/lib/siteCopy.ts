export const SITE_STAT_DEFAULTS = {
  heritage_years: "25+",
  heritage_ranges: "11",
  heritage_provinces: "9",
  heritage_families: "5M+",
} as const;

export type SiteStats = {
  years: string;
  ranges: string;
  provinces: string;
  families: string;
};

export function resolveSiteStats(settings?: Record<string, string | undefined>): SiteStats {
  return {
    years: settings?.heritage_years || SITE_STAT_DEFAULTS.heritage_years,
    ranges: settings?.heritage_ranges || SITE_STAT_DEFAULTS.heritage_ranges,
    provinces: settings?.heritage_provinces || SITE_STAT_DEFAULTS.heritage_provinces,
    families: settings?.heritage_families || SITE_STAT_DEFAULTS.heritage_families,
  };
}

export const CONTACT_DEFAULTS = {
  contact_email: "info@goldenfresh.co.za",
  contact_phone: "",
  contact_address: "Lenasia, Johannesburg, South Africa",
  contact_hours: "Monday – Friday, 8am – 5pm",
  facebook_url: "#",
  instagram_url: "#",
  tiktok_url: "#",
} as const;

export type ContactInfo = typeof CONTACT_DEFAULTS;

export function resolveContactInfo(settings?: Record<string, string | undefined>): ContactInfo {
  return {
    contact_email: settings?.contact_email || CONTACT_DEFAULTS.contact_email,
    contact_phone: settings?.contact_phone ?? CONTACT_DEFAULTS.contact_phone,
    contact_address: settings?.contact_address || CONTACT_DEFAULTS.contact_address,
    contact_hours: settings?.contact_hours || CONTACT_DEFAULTS.contact_hours,
    facebook_url: settings?.facebook_url || CONTACT_DEFAULTS.facebook_url,
    instagram_url: settings?.instagram_url || CONTACT_DEFAULTS.instagram_url,
    tiktok_url: settings?.tiktok_url || CONTACT_DEFAULTS.tiktok_url,
  };
}

const DEFAULT_FOOTER_TAGLINE = "Delight in every Bite. Baked in Lenasia since 1998.";
const LEGACY_FOOTER_TAGLINE = /Lekker biscuits for every SA family|Delivering local lekkerness/i;

export function resolveFooterTagline(value?: string) {
  if (!value || LEGACY_FOOTER_TAGLINE.test(value)) return DEFAULT_FOOTER_TAGLINE;
  return value;
}
