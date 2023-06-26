WITH missions_to_delete AS (
    SELECT id
    FROM missions
    WHERE mission_source = 'MONITORFISH' AND NOT id IN (SELECT mission_id FROM env_actions)
),

t1 AS (
    DELETE FROM missions_control_resources
    WHERE mission_id IN (SELECT id FROM missions_to_delete)
),

t2 AS (
    DELETE FROM missions_control_units
    WHERE mission_id IN (SELECT id FROM missions_to_delete)
)

DELETE FROM missions
WHERE id IN (SELECT id FROM missions_to_delete);