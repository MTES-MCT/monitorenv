SELECT
    parents.name as theme,
    subthemes.name AS subtheme,
    subthemes.id AS subtheme_id
FROM public.themes subthemes
JOIN public.themes parents
ON parents.id = subthemes.parent_id
ORDER BY 1, 2