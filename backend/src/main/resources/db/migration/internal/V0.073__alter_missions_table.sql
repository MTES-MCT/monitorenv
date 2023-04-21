ALTER TABLE public.missions
    ADD COLUMN has_mission_order boolean NOT NULL DEFAULT FALSE,
    ADD COLUMN is_under_jdp boolean NOT NULL DEFAULT FALSE;
