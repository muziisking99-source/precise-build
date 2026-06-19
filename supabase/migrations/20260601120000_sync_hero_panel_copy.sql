-- Sync home hero copy to current brand defaults (Delight / 11 Ranges)
UPDATE public.hero_panels SET
  badge_text = 'Proudly South African · Est. 1998',
  heading_1 = 'Delight',
  heading_2 = 'In every',
  heading_3 = 'Bite.',
  heading_4 = NULL,
  subtext = 'From Lenasia to the nation — quality at honest prices, baked since 1998.',
  cta_1_text = NULL,
  cta_2_text = 'Our Story →',
  is_active = true
WHERE panel_number = 1
  AND (
    heading_1 ILIKE '%Lekker%'
    OR heading_2 ILIKE '%Biscuits%'
    OR heading_3 ILIKE '%For Every%'
    OR heading_4 ILIKE '%Family%'
  );

UPDATE public.hero_panels SET
  badge_text = '11 Ranges · One Nation',
  heading_1 = '11 Ranges.',
  heading_2 = 'One Nation.',
  heading_3 = NULL,
  heading_4 = NULL,
  subtext = 'Glucose Energy, Just Ginger, Luv-A-Lot, All-Star, Joker and more — baked in Lenasia, loved in every province.',
  cta_1_text = NULL,
  cta_2_text = NULL,
  is_active = true
WHERE panel_number = 2
  AND (
    badge_text ILIKE '%Nine%'
    OR badge_text ILIKE '%9 RANGES%'
    OR badge_text ILIKE '%30+%'
    OR heading_1 ILIKE '%Nine%'
    OR heading_2 ILIKE '%Beloved%'
    OR heading_1 ILIKE '%Nine Ranges%'
  )
  AND badge_text NOT ILIKE '%11 Ranges%'
  AND heading_1 NOT ILIKE '%11 Ranges%';
