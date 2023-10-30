ALTER TABLE public.missions_control_resources
    ADD CONSTRAINT fk_missions_control_resources_control_resource_id_control_unit_resources
        FOREIGN KEY (control_resource_id)
        REFERENCES public.control_unit_resources(id);

-- Remove duplicates in `missions_control_resources` (both same `mission_id` and `control_resource_id`):

WITH missions_with_duplicate_resources AS (
    SELECT
        mission_id,
        control_resource_id,
        ARRAY_AGG(id) AS ids
    FROM missions_control_resources
    GROUP BY 1, 2
    HAVING COUNT(*) > 1
),

missions_with_duplicate_resources_unnested AS (
    SELECT
        mission_id,
        control_resource_id,
        unnest(ids) AS id
    FROM missions_with_duplicate_resources
),

missions_with_duplicate_resources_numbered AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY mission_id, control_resource_id ORDER BY id) AS rk
    FROM missions_with_duplicate_resources_unnested
),

missions_control_resources_to_delete AS (
    SELECT id
    FROM missions_with_duplicate_resources_numbered
    WHERE rk > 1
)

DELETE FROM missions_control_resources
WHERE id IN (SELECT id FROM missions_control_resources_to_delete)
