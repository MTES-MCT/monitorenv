INSERT INTO public.control_plan_sub_themes (id, subtheme, theme_id, year)
SELECT nextval('control_plan_sub_themes_id_seq'), subtheme, theme_id, 2025
FROM public.control_plan_sub_themes
WHERE year = 2024;