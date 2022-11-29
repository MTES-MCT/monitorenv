ALTER TABLE public.missions ADD COLUMN closed boolean NOT NULL default false;
UPDATE public.missions SET closed = true WHERE mission_status = 'CLOSED';
ALTER TABLE public.missions DROP COLUMN mission_status;