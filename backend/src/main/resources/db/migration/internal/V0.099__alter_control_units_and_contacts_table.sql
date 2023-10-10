ALTER TABLE public.control_units
    ADD COLUMN department VARCHAR;

ALTER TABLE public.control_unit_contacts
    DROP COLUMN note;
