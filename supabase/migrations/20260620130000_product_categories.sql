-- Top-level product categories (Single, Bulk, custom)
CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  cta_text text,
  cta_variant text NOT NULL DEFAULT 'red' CHECK (cta_variant IN ('red', 'secondary')),
  route_path text NOT NULL DEFAULT '/products',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_categories TO authenticated;
GRANT ALL ON public.product_categories TO service_role;

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible categories"
  ON public.product_categories FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins view all categories"
  ON public.product_categories FOR SELECT TO authenticated
  USING (public.has_admin_access(auth.uid()));

CREATE POLICY "Admins manage categories"
  ON public.product_categories FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

CREATE TRIGGER trg_product_categories_updated
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.product_categories (slug, title, description, cta_text, cta_variant, route_path, sort_order)
VALUES
  (
    'single',
    'Single Biscuits',
    'Individually wrapped for freshness — perfect for on-the-go snacking, lunchboxes, and quick treats.',
    'Explore Single Biscuits',
    'red',
    '/products/single',
    1
  ),
  (
    'bulk',
    'Bulk Biscuits',
    'Family-size value packs for events, sharing, or stocking up — same Golden Fresh quality, bigger boxes.',
    'Explore Bulk Biscuits',
    'secondary',
    '/products/bulk',
    2
  )
ON CONFLICT (slug) DO NOTHING;

-- Link ranges and carousel images to categories
ALTER TABLE public.product_ranges DROP CONSTRAINT IF EXISTS product_ranges_category_chk;

ALTER TABLE public.product_ranges
  DROP CONSTRAINT IF EXISTS product_ranges_category_fkey;

ALTER TABLE public.product_ranges
  ADD CONSTRAINT product_ranges_category_fkey
  FOREIGN KEY (category) REFERENCES public.product_categories (slug)
  ON UPDATE CASCADE;

ALTER TABLE public.category_carousel_images
  DROP CONSTRAINT IF EXISTS category_carousel_images_category_check;

ALTER TABLE public.category_carousel_images
  DROP CONSTRAINT IF EXISTS category_carousel_images_category_fkey;

ALTER TABLE public.category_carousel_images
  ADD CONSTRAINT category_carousel_images_category_fkey
  FOREIGN KEY (category) REFERENCES public.product_categories (slug)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
