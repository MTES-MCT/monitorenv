ALTER TABLE IF EXISTS public.control_topics
    RENAME TO control_themes;
ALTER TABLE public.control_themes RENAME COLUMN topic_level_1 TO theme_level_1;
ALTER TABLE public.control_themes RENAME COLUMN topic_level_2 TO theme_level_2;
ALTER SEQUENCE IF EXISTS public.control_topics_id_seq RENAME TO control_themes_id_seq;

UPDATE public.control_themes
    SET theme_level_1 = 'Activités et manifestations soumises à évaluation d’incidence Natura 2000'
    WHERE theme_level_1 ilike 'Activités et manifestations soumises à évaluation d’incidence Natura%';
