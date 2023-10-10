ALTER TABLE public.bases
    ADD COLUMN latitude DOUBLE PRECISION NOT NULL,
    ADD COLUMN longitude DOUBLE PRECISION NOT NULL;

-- Drop and re-add the existing constraint to remove the `ON DELETE CASCADE` option declared in `V0.096`
ALTER TABLE public.control_unit_resources
    DROP CONSTRAINT fk_control_unit_resources_base_id_bases;
ALTER TABLE public.control_unit_resources
    ADD CONSTRAINT fk_control_unit_resources_base_id_bases
        FOREIGN KEY (base_id)
        REFERENCES bases(id);
