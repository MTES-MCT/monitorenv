ALTER TABLE public.missions RENAME COLUMN observations TO observations_cacem;
ALTER TABLE public.missions ADD COLUMN  observations_cnsp text;
ALTER TABLE public.missions ADD COLUMN  mission_source text;

UPDATE public.missions SET mission_source = 'CACEM';

ALTER TABLE public.missions ALTER COLUMN mission_source SET NOT NULL;