ALTER TABLE public.control_units
    ADD COLUMN department VARCHAR NOT NULL DEFAULT '',
    ADD COLUMN sea_front VARCHAR NOT NULL DEFAULT 'UNKNOWN';

ALTER TABLE public.control_unit_contacts
    DROP COLUMN note;
