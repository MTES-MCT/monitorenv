WITH departments_intersection_areas AS (
    SELECT
        env_actions.id,
        departments_areas.insee_dep,
        SUM(ST_Area(ST_Intersection(ST_MakeValid(env_actions.geom), departments_areas.geometry)::geography)) AS intersection_area
    FROM env_actions
    JOIN missions
    ON missions.id = env_actions.mission_id
    LEFT JOIN departments_areas
    ON ST_Intersects(env_actions.geom, departments_areas.geometry)
    WHERE missions.mission_source = 'MONITORENV'
    GROUP BY env_actions.id, departments_areas.insee_dep
),

ranked_departments_intersection_areas AS (
    SELECT
        id,
        insee_dep,
        RANK() OVER (PARTITION BY id ORDER BY intersection_area DESC) AS rk
    FROM departments_intersection_areas
),

env_actions_departments AS (
    SELECT
        id,
        insee_dep
    FROM ranked_departments_intersection_areas
    WHERE rk = 1
)

UPDATE env_actions
SET department = env_actions_departments.insee_dep
FROM env_actions_departments
WHERE env_actions.id = env_actions_departments.id;