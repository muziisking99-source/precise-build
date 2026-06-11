
ALTER TABLE public.product_ranges ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'single';
ALTER TABLE public.product_ranges ADD CONSTRAINT product_ranges_category_chk CHECK (category IN ('single','bulk'));
-- Seed a Bulk range so users have somewhere to put bulk products
INSERT INTO public.product_ranges (slug, name, description, sort_order, category)
VALUES ('bulk', 'Bulk Biscuits', 'Bulk packs for families, spaza shops and events.', 100, 'bulk')
ON CONFLICT (slug) DO UPDATE SET category = 'bulk';
