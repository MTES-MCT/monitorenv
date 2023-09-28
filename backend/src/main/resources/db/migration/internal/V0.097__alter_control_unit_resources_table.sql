INSERT INTO public.bases
  (   id,           name)
VALUES
  (    0,    'Base non affectée');

-- Set a default `base_id` and `type` for all existing null values
UPDATE public.control_unit_resources
SET
    base_id = COALESCE(base_id, 1),
    type = COALESCE(type, 'UNKNOWN');

ALTER TABLE public.control_unit_resources
    ALTER COLUMN base_id SET NOT NULL,
    ALTER COLUMN type SET NOT NULL;
