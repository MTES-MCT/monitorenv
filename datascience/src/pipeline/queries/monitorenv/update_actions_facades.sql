WITH facades_intersection_areas AS (
    SELECT
        env_actions.id,
        facade_areas_subdivided.facade,
        SUM(ST_Area(ST_Intersection(ST_MakeValid(env_actions.geom), facade_areas_subdivided.geometry)::geography)) AS intersection_area
    FROM env_actions
    JOIN missions
    ON missions.id = env_actions.mission_id
    LEFT JOIN facade_areas_subdivided
    ON ST_Intersects(
        ST_MakeValid(
            CASE WHEN env_actions.action_type = 'SURVEILLANCE' AND env_actions.value->>'cover_mission_zone' = 'true' THEN COALESCE(missions.geom, env_actions.geom)
            ELSE COALESCE(env_actions.geom, missions.geom) END
        ),
        facade_areas_subdivided.geometry
    )
    WHERE missions.mission_source IN ('MONITORENV', 'MONITORFISH')
    GROUP BY env_actions.id, facade_areas_subdivided.facade
),

ranked_facades_intersection_areas AS (
    SELECT
        id,
        facade,
        RANK() OVER (PARTITION BY id ORDER BY intersection_area DESC) AS rk
    FROM facades_intersection_areas
),

env_actions_facades AS (
    SELECT
        id,
        facade
    FROM ranked_facades_intersection_areas
    WHERE rk = 1
)

UPDATE env_actions
SET facade = env_actions_facades.facade
FROM env_actions_facades
WHERE env_actions.id = env_actions_facades.id;