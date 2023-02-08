CREATE TYPE mission_source_type AS ENUM ('MONITORENV', 'MONITORFISH', 'POSEIDON_CACEM', 'POSEIDON_CNSP');

UPDATE public.missions
SET mission_source  = 'MONITORENV'
WHERE mission_source = 'CACEM';

UPDATE public.missions
SET mission_source  = 'MONITORFISH'
WHERE mission_source = 'CNSP';

ALTER TABLE public.missions
ALTER COLUMN mission_source
TYPE mission_source_type
USING mission_source::mission_source_type;