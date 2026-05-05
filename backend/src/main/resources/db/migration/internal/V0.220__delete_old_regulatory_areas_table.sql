ALTER TABLE dashboard_datas DROP CONSTRAINT fk_regulatory_cacem;

DELETE FROM dashboard_datas
WHERE NOT EXISTS (
    SELECT 1
    FROM regulatory_areas
    WHERE regulatory_areas.id = dashboard_datas.regulations_cacem_id
);

ALTER TABLE dashboard_datas
ADD CONSTRAINT fk_regulatory_cacem FOREIGN KEY (regulations_cacem_id) REFERENCES public.regulatory_areas (id);

DROP TABLE public.regulations_cacem;
DROP TABLE public.themes_regulatory_areas;
DROP TABLE public.tags_regulatory_areas;
ALTER TABLE public.tags_regulatory_areas_new RENAME TO tags_regulatory_areas;
ALTER TABLE public.themes_regulatory_areas_new RENAME TO themes_regulatory_areas;

ALTER TABLE public.regulatory_areas
    DROP COLUMN thematique,
    DROP COLUMN duree_validite,
    DROP COLUMN temporalite,
    ADD COLUMN row_hash text;

UPDATE public.regulatory_areas SET row_hash = md5(
    COALESCE(geom::text, '') ||
    COALESCE(ref_reg::text, '')
);

CREATE FUNCTION public.create_row_hash() RETURNS trigger AS $$
    BEGIN
        NEW.row_hash := md5(
            COALESCE(NEW.geom::text, '') ||
            COALESCE(NEW.ref_reg::text, '')
        );
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_row_hash
    BEFORE INSERT OR UPDATE ON public.regulatory_areas
    FOR EACH ROW
    EXECUTE PROCEDURE public.create_row_hash();


