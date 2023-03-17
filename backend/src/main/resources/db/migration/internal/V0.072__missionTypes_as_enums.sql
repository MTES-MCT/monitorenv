ALTER TABLE public.missions ADD COLUMN mission_types text[];
UPDATE public.missions SET mission_types = ARRAY[mission_type];
ALTER TABLE public.missions DROP COLUMN mission_type;
