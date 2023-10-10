ALTER TABLE public.missions_control_resources
DROP CONSTRAINT fk_missions_control_resources_control_resource_id_control_unit_resources;

TRUNCATE public.control_unit_resources;

ALTER TABLE public.control_unit_resources
    ALTER COLUMN base_id SET NOT NULL,
    ALTER COLUMN type SET NOT NULL;
