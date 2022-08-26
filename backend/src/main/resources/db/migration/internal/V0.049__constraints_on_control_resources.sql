TRUNCATE public.control_resources;
ALTER TABLE public.control_resources ALTER COLUMN administration SET NOT NULL;
ALTER TABLE public.control_resources ALTER COLUMN unit SET NOT NULL;
ALTER TABLE public.control_resources ALTER COLUMN resource_name SET NOT NULL;
ALTER TABLE public.control_resources ADD UNIQUE (administration, unit, resource_name);
CREATE SEQUENCE public.control_resources_id_seq;
ALTER TABLE public.control_resources ALTER COLUMN id SET DEFAULT nextval('control_resources_id_seq');