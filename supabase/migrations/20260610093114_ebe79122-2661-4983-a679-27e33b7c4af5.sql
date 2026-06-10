
-- ============ HELPER FUNCTIONS ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ ADMIN USERS (allowlist) ============
CREATE TABLE public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read admin_users"
  ON public.admin_users FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.has_admin_access(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = _uid)
$$;

-- ============ PRODUCT RANGES ============
CREATE TABLE public.product_ranges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_ranges TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_ranges TO authenticated;
GRANT ALL ON public.product_ranges TO service_role;
ALTER TABLE public.product_ranges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view ranges" ON public.product_ranges FOR SELECT USING (true);
CREATE POLICY "Admins manage ranges" ON public.product_ranges FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid())) WITH CHECK (public.has_admin_access(auth.uid()));
CREATE TRIGGER trg_ranges_updated BEFORE UPDATE ON public.product_ranges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PRODUCTS ============
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  range_id uuid NOT NULL REFERENCES public.product_ranges(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  pill_text text,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible products" ON public.products FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins view all products" ON public.products FOR SELECT TO authenticated
  USING (public.has_admin_access(auth.uid()));
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid())) WITH CHECK (public.has_admin_access(auth.uid()));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ CHARACTERS ============
CREATE TABLE public.characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  range text,
  description text,
  pill_text text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.characters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.characters TO authenticated;
GRANT ALL ON public.characters TO service_role;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible characters" ON public.characters FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins view all characters" ON public.characters FOR SELECT TO authenticated
  USING (public.has_admin_access(auth.uid()));
CREATE POLICY "Admins manage characters" ON public.characters FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid())) WITH CHECK (public.has_admin_access(auth.uid()));
CREATE TRIGGER trg_characters_updated BEFORE UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ HERO PANELS ============
CREATE TABLE public.hero_panels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_number integer NOT NULL UNIQUE,
  heading_1 text,
  heading_2 text,
  heading_3 text,
  heading_4 text,
  subtext text,
  cta_1_text text,
  cta_2_text text,
  badge_text text,
  card_1_label text,
  card_2_label text,
  card_3_label text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_panels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hero_panels TO authenticated;
GRANT ALL ON public.hero_panels TO service_role;
ALTER TABLE public.hero_panels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view hero" ON public.hero_panels FOR SELECT USING (true);
CREATE POLICY "Admins manage hero" ON public.hero_panels FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid())) WITH CHECK (public.has_admin_access(auth.uid()));
CREATE TRIGGER trg_hero_updated BEFORE UPDATE ON public.hero_panels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ TESTIMONIALS ============
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  name text NOT NULL,
  location text,
  stars integer NOT NULL DEFAULT 5,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible testimonials" ON public.testimonials FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins view all testimonials" ON public.testimonials FOR SELECT TO authenticated
  USING (public.has_admin_access(auth.uid()));
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid())) WITH CHECK (public.has_admin_access(auth.uid()));
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SITE SETTINGS ============
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_admin_access(auth.uid())) WITH CHECK (public.has_admin_access(auth.uid()));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ CONTENT LOG ============
CREATE TABLE public.content_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  item_name text,
  user_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.content_log TO authenticated;
GRANT ALL ON public.content_log TO service_role;
ALTER TABLE public.content_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read log" ON public.content_log FOR SELECT TO authenticated
  USING (public.has_admin_access(auth.uid()));
CREATE POLICY "Admins write log" ON public.content_log FOR INSERT TO authenticated
  WITH CHECK (public.has_admin_access(auth.uid()));
