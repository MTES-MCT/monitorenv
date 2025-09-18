CREATE TYPE vigilance_area_source_type AS ENUM ('CONTROL_UNIT', 'OTHER', 'INTERNAL');

ALTER TABLE public.vigilance_areas_source
    ADD COLUMN comments      VARCHAR,
    ADD COLUMN link          VARCHAR,
    ADD COLUMN is_anonymous  BOOLEAN DEFAULT FALSE,
    ADD COLUMN type          vigilance_area_source_type;


UPDATE public.vigilance_areas_source
SET type = 'CONTROL_UNIT'::vigilance_area_source_type
WHERE control_unit_contacts_id IS NOT NULL;

UPDATE public.vigilance_areas_source
SET type = 'OTHER'::vigilance_area_source_type
WHERE control_unit_contacts_id IS NULL;

