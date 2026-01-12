ALTER TABLE public.regulations_cacem
    ADD COLUMN plan character varying,
    ADD COLUMN poly_name character varying,
    ADD COLUMN resume character varying;

UPDATE public.regulations_cacem SET row_hash = md5(
      COALESCE(entity_name::text, '') ||
      COALESCE(url::text, '') ||
      COALESCE(layer_name::text, '') ||
      COALESCE(facade::text, '') ||
      COALESCE(ref_reg::text, '') ||
      COALESCE(editeur::text, '') ||
      COALESCE(source::text, '') ||
      COALESCE(observation::text, '') ||
      COALESCE(thematique::text, '') ||
      COALESCE(duree_validite::text, '') ||
      COALESCE(temporalite::text, '') ||
      COALESCE(type::text, '') ||
      COALESCE(date::text, '') ||
      COALESCE(date_fin::text, '') ||
      COALESCE(edition::text, '') ||
      COALESCE(plan::text, '') ||
      COALESCE(poly_name::text, '') ||
      COALESCE(resume::text, '')

);
