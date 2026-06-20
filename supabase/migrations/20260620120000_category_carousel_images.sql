-- Category card carousel images (products landing page)
CREATE TABLE public.category_carousel_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('single', 'bulk')),
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.category_carousel_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.category_carousel_images TO authenticated;
GRANT ALL ON public.category_carousel_images TO service_role;

ALTER TABLE public.category_carousel_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible carousel images"
  ON public.category_carousel_images FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins view all carousel images"
  ON public.category_carousel_images FOR SELECT TO authenticated
  USING (public.has_admin_access(auth.uid()));

CREATE POLICY "Admins manage carousel images"
  ON public.category_carousel_images FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid()))
  WITH CHECK (public.has_admin_access(auth.uid()));

CREATE TRIGGER trg_category_carousel_updated
  BEFORE UPDATE ON public.category_carousel_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_category_carousel_category_sort
  ON public.category_carousel_images (category, sort_order);
