# Golden Fresh Admin — Build Plan

A password-protected admin at `/admin` lets the Golden Fresh team manage all public site content via Lovable Cloud (no code edits required).

## Scope

### 1. Database (single migration)
Tables (all with RLS + GRANTs):
- `product_ranges` — id, slug, name, description, sort_order
- `products` — id, range_id, name, description, image_url, pill_text, is_visible, sort_order
- `characters` — id, name, role, range, description, pill_text, image_url, sort_order, is_visible
- `hero_panels` — id, panel_number, heading_1..4, subtext, cta_1_text, cta_2_text, badge_text, card labels, image_url, is_active
- `testimonials` — id, quote, name, location, stars, is_visible, sort_order
- `site_settings` — key (PK), value, updated_at
- `content_log` — id, action, item_name, created_at
- `admin_users` — user_id (PK → auth.users) — allowlist; only listed users can write
- `has_admin_access(uid)` SECURITY DEFINER function

**RLS:**
- Public `SELECT` on content tables (filtered by `is_visible` where applicable)
- `INSERT/UPDATE/DELETE` only when `has_admin_access(auth.uid())`
- `admin_users` table read by authenticated only (used by the function)

**Storage buckets (public):** `product-images`, `character-images`, `hero-images`

Seed with the existing 9 ranges + current characters + hero defaults so the admin opens with real data.

### 2. Auth
- `/admin/login` — email + password, `signInWithPassword`
- Route guard wrapping all `/admin/*` — redirects to `/admin/login` if no session OR user not in `admin_users`
- Sign out clears session and redirects

### 3. Admin Shell
Persistent layout (`AdminLayout`):
- 260px dark sidebar with logo, 7 nav links, sign-out
- 64px topbar with page title + user email + avatar initials
- Dark theme tokens (`--admin-bg #111318`, `--admin-surface #1C1F28`, `--admin-gold #D4920A`, `--admin-red #C41C1C`)
- Mobile: sidebar collapses to hamburger overlay

### 4. Pages
1. **Dashboard** `/admin/dashboard` — 4 stat cards, recent activity from `content_log`, 3 quick action cards
2. **Products** `/admin/products` — left range list + right product grid; add/edit drawer with image upload, name, description, pill, visibility, sort order
3. **Characters** `/admin/characters` — grid of character cards with image upload + edit drawer
4. **Hero Sections** `/admin/hero` — 3 panel editor (Brand / Products / Biscuit Gang) with text fields + image uploads
5. **Testimonials** `/admin/testimonials` — table view + add/edit drawer + visibility toggle + delete confirm
6. **Contact Info** `/admin/contact-info` — form for email, phone, address, hours, social URLs (stored in `site_settings`)
7. **Site Settings** `/admin/settings` — ribbon text, footer tagline, "Find a Store" URL, admin account info, image cache clear

### 5. Shared admin UI
- Image upload component (file picker, 5MB validation, preview, upload to bucket, old image deletion)
- Toast notifications (success/error, auto-dismiss)
- Confirmation modal for destructive actions
- Drawer for add/edit forms
- Toggle switch (gold/grey)

### 6. Public site integration
Update existing public pages (Home, Products, Contact, footer) to read from Supabase instead of `src/data/products.ts`. Keep hardcoded data as fallback while migrating.

## Out of scope (per spec)
- Public signup (admins created in backend dashboard only)
- WYSIWYG editor (textareas only)
- Drag-to-reorder (use sort_order numbers)
- Media library browser

## Technical notes
- Direct `supabase` client calls from admin components (no server functions needed — RLS handles security)
- TanStack Router file-based routing under `src/routes/admin/`
- Admin layout isolated from public site nav/footer/cursor
- After first admin user is created in the backend Users panel, add their `user_id` to `admin_users` (I'll provide SQL snippet)

## Delivery
Given the size, I'll build in this order in one go:
1. Migration (schema + RLS + seed + storage buckets)
2. Auth + admin layout + route guards
3. Dashboard + Products (highest-value pages)
4. Characters, Hero, Testimonials, Contact Info, Settings
5. Wire public pages to read from DB

Approve and I'll start.
