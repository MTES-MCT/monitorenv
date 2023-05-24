WITH facades_intersection_areas AS (
    SELECT
        missions.id,
        facade_areas_subdivided.facade,
        SUM(ST_Area(ST_Intersection(missions.geom, facade_areas_subdivided.geometry)::geography)) AS intersection_area
    FROM facade_areas_subdivided
    JOIN missions
    ON ST_Intersects(missions.geom, facade_areas_subdivided.geometry)
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

UPDATE missions
SET facade = missions_facades.facade
FROM missions_facades
WHERE missions.id = missions_facades.id;