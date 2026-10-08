WITH facades_intersection_areas AS (
    SELECT
        vigilance_areas.id,
        facade_areas_subdivided.facade,
        SUM(ST_Area(ST_Intersection(ST_MakeValid(vigilance_areas.geom), facade_areas_subdivided.geometry)::geography)) AS intersection_area
    FROM vigilance_areas
    LEFT JOIN facade_areas_subdivided
    ON ST_Intersects(ST_MakeValid(vigilance_areas.geom), facade_areas_subdivided.geometry)
    WHERE vigilance_areas.geom IS NOT NULL
    GROUP BY vigilance_areas.id, facade_areas_subdivided.facade
),

ranked_facades_intersection_areas AS (
    SELECT
        id,
        facade,
        RANK() OVER (PARTITION BY id ORDER BY intersection_area DESC) AS rk
    FROM facades_intersection_areas
),

vigilance_areas_facades AS (
    SELECT
        id,
        facade
    FROM ranked_facades_intersection_areas
    WHERE rk = 1
)

UPDATE vigilance_areas v
SET sea_front = vf.facade
FROM vigilance_areas_facades vf
WHERE v.id = vf.id;