WITH facades_intersection_areas AS (
    SELECT
        regulatory_areas.id,
        facade_areas_subdivided.facade,
        SUM(ST_Area(ST_Intersection(ST_MakeValid(regulatory_areas.geom), facade_areas_subdivided.geometry)::geography)) AS intersection_area
    FROM regulatory_areas
    LEFT JOIN facade_areas_subdivided
    ON ST_Intersects(ST_MakeValid(regulatory_areas.geom), facade_areas_subdivided.geometry)
    WHERE regulatory_areas.geom IS NOT NULL
    GROUP BY regulatory_areas.id, facade_areas_subdivided.facade
),

ranked_facades_intersection_areas AS (
    SELECT
        id,
        facade,
        RANK() OVER (PARTITION BY id ORDER BY intersection_area DESC) AS rk
    FROM facades_intersection_areas
),

regulatory_areas_facades AS (
    SELECT
        id,
        facade
    FROM ranked_facades_intersection_areas
    WHERE rk = 1
)

UPDATE regulatory_areas r
SET facade = rf.facade
FROM regulatory_areas_facades rf
WHERE r.id = rf.id;