-- add seaFront --
UPDATE vigilance_areas
    SET sea_front = (
 		WITH geom AS (
             SELECT st_setsrid(geom, 4326) AS geom
        ),
        facades_intersection_areas AS (
             SELECT
                 facade,
                 SUM(
                     ST_Area(
                         CAST(
                             ST_Intersection(
                                 geom.geom,
                                 facade_areas_subdivided.geometry
                             ) AS geography
                         )
                     )
                 ) AS intersection_area
             FROM facade_areas_subdivided
             JOIN geom
             ON ST_Intersects(geom.geom, facade_areas_subdivided.geometry)
             GROUP BY facade
        )
 		SELECT facade
         FROM facades_intersection_areas
         ORDER BY intersection_area DESC
         LIMIT 1
 	);


