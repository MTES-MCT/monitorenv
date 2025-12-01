WITH facades_intersection_areas AS (
    SELECT
        missions.id,
        facade_areas_subdivided.facade,
        SUM(ST_Area(ST_Intersection(ST_MakeValid(missions.geom), facade_areas_subdivided.geometry)::geography)) AS intersection_area
    FROM missions
    LEFT JOIN facade_areas_subdivided
    ON ST_Intersects(ST_MakeValid(missions.geom), facade_areas_subdivided.geometry)
    WHERE mission_source IN ('MONITORENV', 'MONITORFISH')
    GROUP BY missions.id, facade_areas_subdivided.facade
),

ranked_facades_intersection_areas AS (
    SELECT
        id,
        facade,
        RANK() OVER (PARTITION BY id ORDER BY intersection_area DESC) AS rk
    FROM facades_intersection_areas
),

missions_facades AS (
    SELECT
        id,
        facade
    FROM ranked_facades_intersection_areas
    WHERE rk = 1
)

UPDATE missions m
SET facade = mf.facade
FROM missions_facades mf
WHERE m.id = mf.id;