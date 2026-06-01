# Golden Fresh Biscuits — Site Overview

Current state of the marketing website in this repository (as of the classy full-site redesign).

---

## What this site is

A **single-brand marketing site** for **Golden Fresh Biscuits**, a proudly South African biscuit manufacturer (Yunma Foods) based in **Lenasia, Johannesburg**, established **1998**. The site introduces the brand, product ranges, mascots, heritage story, and contact paths for consumers, stockists, and distributors.

It is **not** an e-commerce store: there is no cart, checkout, or product API. CTAs point to product exploration pages and placeholder actions (e.g. “Find a Store”, “Become a Stockist”).

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7) |
| Routing | [TanStack Router](https://tanstack.com/router) — file-based routes under `src/routes/` |
| Styling | Tailwind CSS v4 (`src/styles.css` + design tokens in `:root`) |
| Motion | [Framer Motion](https://www.framer.com/motion/) — route transitions + scroll reveals |
| Icons | [Lucide React](https://lucide.dev/) (About, Contact value/contact rows) |
| UI primitives | shadcn/ui components in `src/components/ui/` (available; main pages use custom CSS) |
| Data | Static TypeScript in `src/data/products.ts` — no CMS or database |

**Scripts:** `npm run dev` · `npm run build` · `npm run preview`

---

## Site map & routes

```
/                     Home — hero, ranges teaser, mascots, heritage, testimonials
/about                Brand story, mission, timeline, values, stats
/contact              Contact form (client-side submit), info, map placeholder
/products             Category landing — Single vs Bulk
/products/single      Full single-pack ranges with filter tabs
/products/bulk        Bulk product grid
```

404 and error boundaries live on the root route (`src/routes/__root.tsx`).

Nested `/products` routes use a **second** `AnimatedOutlet` so sub-page navigation animates independently of top-level routes.

---

## Page-by-page content

### Home (`/`)

- **Hero:** Asymmetric split layout — “Lekker Biscuits” (script accent) + logo stage, stats bar (25+ years, 9 ranges, 9 provinces).
- **Ribbon:** Infinite horizontal marquee of range names (red band).
- **Our Ranges:** Six product teasers in a **zig-zag** two-column layout with SVG mascots.
- **Biscuit Gang:** Horizontally scrollable character cards (5 mascots).
- **Heritage:** Two-column block — logo, 1998 badge, copy + stat tiles.
- **Gold band:** CTA to shop products.
- **Testimonials:** Three quotes (one featured wide card on large screens).
- **Red band:** Find a stockist CTA.

### About (`/about`)

- **Page hero:** Left-aligned — “Baked With Pride Since 1998”.
- **Mission:** Pull-quote + three value cards (Made in SA, Honest Prices, Real Ingredients) with Lucide icons.
- **Timeline:** Vertical editorial timeline (1998 → 2024).
- **Golden Values:** Four centered value cards (Community, Quality, Affordability, Proudly SA).
- **Stats bar:** Years / ranges / provinces / families (monospace numerals).
- **Red band:** Stockist CTA.

### Contact (`/contact`)

- **Page hero:** “Get In Touch”.
- **Two columns:** Contact details (email, location, brand, hours) + enquiry form (name, email, phone, subject, message). Submit toggles a thank-you message locally (no backend).
- **Map section:** Placeholder empty state (“Map coming soon”) + Lenasia bakery copy.
- **Red band:** Stockist CTA.

### Products (`/products`)

- **Page hero:** Product categories intro.
- **Two category cards:** Single Biscuits (warm gold/tan gradient) · Bulk Biscuits (wheat/brown gradient — no purple).

### Single biscuits (`/products/single`)

- Back link to categories.
- **Sticky filter tabs:** All + one tab per range.
- **Per range:** Header with mascot (where applicable) + product cards in a responsive grid.
- **Ranges in data:** Glucose Energy, Just Ginger, Luv-A-Lot, Trio, All-Star, Joker, Marie, Cream Biscuits, Supa Dupa (see `src/data/products.ts`).
- **Gold + red bands** at footer.

### Bulk biscuits (`/products/bulk`)

- Back link, hero, grid of bulk SKUs from `BULK_PRODUCTS` in `src/data/products.ts`.
- **Red band** at footer.

---

## Brand & design system

### Positioning

Friendly, heritage South African family biscuit brand — **“lekker”**, affordable, nationwide since Lenasia 1998.

### Color palette (Editorial Level B)

| Token | Role |
|--------|------|
| `--stone-50` / `--stone-100` / `--stone-200` | Page, alt sections, borders (aliases: `--cream`, `--warm`, `--wheat`) |
| `--stone-800` / `--stone-600` | Primary and muted text (aliases: `--ink`, `--mid`) |
| `--red` / `--red-dk` | **Primary CTA only** (brick red `#C41E24`) |
| `--green` / `--green-dk` | Forest green — nav active, tags, focus rings (not full-width slabs) |
| `--gold` | Antique gold — hairlines, timeline dots, hero accent word |
| Pack yellow (`--yellow`) | Product data only; not used in marketing UI chrome |

### Typography

| Font | Use |
|------|-----|
| **Fraunces** | Headlines, display stats |
| **Outfit** | Body, nav, forms, buttons |

### Layout patterns

- Max content width ~1200–1400px (`.container`).
- Section vertical rhythm: `--section-y` clamp.
- **PageHero** component for inner pages (left-aligned copy).
- **Section** + **SectionHead** for repeatable content blocks.
- Cards: soft diffusion shadows, 2px hover lift, hairline borders.

### Global chrome

- **Nav (64px):** Logo, Home / About / Products / Contact, “Find a Store” CTA. Frosted glass when scrolled. Mobile hamburger menu.
- **Footer:** Logo, tagline, product links, company links, contact blurb, social placeholders.
- **Cursor:** System default (custom cursor disabled for editorial UI).
- **Grain overlay:** Fixed, low-opacity texture (non-interactive).

---

## Motion & accessibility

- **Route transitions:** Fade + slight vertical shift; `AnimatePresence` with `mode="wait"` at root and under `/products`.
- **Scroll reveals:** `MotionReveal` (exported as `Reveal`) — spring physics, once per element in viewport.
- **Page hero enter:** `PageHeroMotion` on mount for inner pages.
- **`prefers-reduced-motion`:** Disables route animation, ribbon scroll, and short-circuits motion components.

---

## Key components

| Path | Purpose |
|------|---------|
| `src/components/Hero.tsx` | Home page hero |
| `src/components/PageHero.tsx` | Inner-page heroes |
| `src/components/Section.tsx` | `Section`, `SectionHead` wrappers |
| `src/components/Layout.tsx` | `Nav`, `Footer`, `SectionTag`, `RedBand`, `GoldBand` |
| `src/components/Logo.tsx` | Brand logo image |
| `src/components/Characters.tsx` | SVG mascots (Supa Dupa, Ginger Man, Luv-A-Lot Girl, All-Star, Joker, etc.) |
| `src/components/RootLayout.tsx` | Shell: grain, cursor, nav, animated outlet, footer |
| `src/components/motion/*` | Framer Motion primitives |
| `src/components/Effects.tsx` | Custom cursor + re-exports `Reveal` |
| `src/data/products.ts` | Single ranges + bulk product catalog |

---

## Mascots & characters

| Character | Associated range |
|-----------|------------------|
| Supa Dupa | Glucose / sunburst hero |
| Ginger Man | Just Ginger |
| Luv-A-Lot Girl | Luv-A-Lot |
| All-Star Footballer | All-Star |
| Joker Hat | Joker |

All mascots are **inline SVG** React components, not raster assets.

---

## What is not implemented

- Backend / API / form email delivery
- Store locator map or geolocation
- User accounts, authentication, admin
- CMS-driven content (all copy is in TSX / data files)
- Analytics wiring (unless added elsewhere in deploy config)
- i18n (English only)
- Dark mode toggle (tokens exist for shadcn; marketing pages use light cream theme)

---

## Project structure (high level)

```
precise-build/
├── SITE.md                 ← this file
├── package.json
├── src/
│   ├── routes/             # File-based pages (+ __root.tsx shell)
│   ├── components/         # UI, layout, motion, mascots
│   ├── data/               # Product catalog
│   ├── styles.css          # Global design system
│   ├── router.tsx
│   └── routeTree.gen.ts    # Auto-generated — do not edit
└── public/                 # Static assets (favicon, brand images)
```

---

## SEO & meta

Per-route `head()` hooks set `title` and `description`. Root route sets Open Graph and Twitter card defaults for Golden Fresh Biscuits.

---

## Deployment notes

Built with `vite build`; TanStack Start / Nitro integration may apply depending on Lovable deploy context (`@lovable.dev/vite-tanstack-config`). Preview locally with `npm run preview` after build.

---

## Summary

The site is a **refined, motion-enhanced brand brochure** for Golden Fresh: cream-and-warm surfaces, red/green/gold accents, heritage storytelling, mascot-led product discovery, and contact/stockist prompts — implemented as a fast static React app with TanStack Start and a custom CSS design system.
