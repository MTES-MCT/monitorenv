ALTER TABLE public.env_actions
    ADD COLUMN observations_by_unit text;

ALTER TABLE public.missions
    ADD COLUMN observations_by_unit text;
