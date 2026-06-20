-- Point custom categories at their product listing pages
UPDATE public.product_categories
SET route_path = '/products/' || slug
WHERE route_path IN ('/products', '/products/')
  AND slug NOT IN ('single', 'bulk');

-- Ensure single/bulk keep their dedicated routes if still on generic path
UPDATE public.product_categories
SET route_path = '/products/single'
WHERE slug = 'single' AND route_path IN ('/products', '/products/');

UPDATE public.product_categories
SET route_path = '/products/bulk'
WHERE slug = 'bulk' AND route_path IN ('/products', '/products/');
