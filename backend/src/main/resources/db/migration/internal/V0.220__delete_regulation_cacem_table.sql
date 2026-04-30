ALTER TABLE dashboard_datas DROP CONSTRAINT fk_regulatory_cacem;

ALTER TABLE dashboard_datas
ADD CONSTRAINT fk_regulatory_cacem FOREIGN KEY (regulations_cacem_id) REFERENCES public.regulatory_areas (id);

DROP TABLE public.regulations_cacem;