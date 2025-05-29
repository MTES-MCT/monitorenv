/* Update resources with new pedestrian resource for each control unit and bases */
INSERT INTO control_unit_resources (base_id, control_unit_id, name, type)
SELECT
    cur.base_id,
    cur.control_unit_id,
    'Piéton (' || b.name || ')' AS name,
    'PEDESTRIAN'::control_unit_resource_type AS type
FROM (
    SELECT DISTINCT base_id, control_unit_id
    FROM control_unit_resources
) cur
JOIN bases b ON b.id = cur.base_id
WHERE NOT EXISTS (
    SELECT 1
    FROM control_unit_resources c
    WHERE
        c.base_id = cur.base_id
        AND c.control_unit_id = cur.control_unit_id
        AND c.name = 'Piéton (' || b.name || ')'
);


/* Update resources with name "Voiture" to add sation name: "Voiture(base)" */
UPDATE control_unit_resources cur
SET name = 'Voiture (' || b.name || ')'
FROM bases b
WHERE cur.base_id = b.id
  AND cur.name = 'Voiture';