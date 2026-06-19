-- Update legacy footer tagline to current brand line
UPDATE public.site_settings
SET value = 'Delight in every Bite. Baked in Lenasia since 1998.'
WHERE key = 'footer_tagline'
  AND (
    value ILIKE '%Lekker biscuits for every SA family%'
    OR value ILIKE '%Delivering local lekkerness%'
    OR value IS NULL
    OR value = ''
  );

INSERT INTO public.site_settings (key, value)
VALUES ('footer_tagline', 'Delight in every Bite. Baked in Lenasia since 1998.')
ON CONFLICT (key) DO NOTHING;
