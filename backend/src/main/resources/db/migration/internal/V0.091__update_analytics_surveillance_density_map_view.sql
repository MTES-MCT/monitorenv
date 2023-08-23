DROP VIEW analytics_surveillance_density_map;

CREATE MATERIALIZED VIEW analytics_surveillance_density_map AS

WITH surveillance_geoms AS (
    SELECT
        m.id AS mission_id,
        a.id AS action_id,
        EXTRACT(EPOCH FROM a.action_end_datetime_utc - a.action_start_datetime_utc)::DOUBLE PRECISION / 3600.0 AS duration,
        CASE WHEN (a.value->>'coverMissionZone')::BOOLEAN THEN m.geom ELSE a.geom END AS geom
    FROM missions m
    JOIN env_actions a
    ON m.id = a.mission_id
    WHERE
        a.action_type = 'SURVEILLANCE' AND
        ST_Area(CASE WHEN (a.value->>'coverMissionZone')::BOOLEAN THEN m.geom ELSE a.geom END) > 0 AND
        a.action_end_datetime_utc > a.action_start_datetime_utc
),

filtered_surveillance_geoms AS (
    SELECT *
    FROM surveillance_geoms
    -- filter on surveillance actions with at least 0.001 hour per km2 of surveillance "density", i.e. 1 hour per 1000 km² for performance reasons
    WHERE duration / (ST_Area(geom::geography) / 1000000) > 0.001
),

surveillance_points AS(
    SELECT
        mission_id,
        action_id,
        duration,
        ST_Area(filtered_surveillance_geoms.geom::geography) / 1000000 AS action_surveillance_area_km2,
        ST_Area(squares.geom::geography) / 1000000 AS square_area_km2,
        ST_X(ST_Centroid(squares.geom)) AS longitude,
        ST_Y(ST_Centroid(squares.geom)) AS latitude
    FROM filtered_surveillance_geoms
    JOIN ST_SquareGrid(0.1, filtered_surveillance_geoms.geom) AS squares
    ON ST_Intersects(filtered_surveillance_geoms.geom, squares.geom)
),

points_per_action AS (
    SELECT
        action_id,
        COUNT(*) AS number_of_squares
    FROM surveillance_points
    GROUP BY action_id
)

SELECT
    pos.mission_id,
    pos.action_id,
    pos.duration AS action_surveillance_hours,
    pos.action_surveillance_area_km2,
    nb.number_of_squares,
    pos.longitude,
    pos.latitude,
    pos.duration / nb.number_of_squares AS square_surveillance_hours,
    square_area_km2,
    pos.duration / nb.number_of_squares / square_area_km2 AS square_hours_per_km2
FROM surveillance_points pos
JOIN points_per_action nb
ON pos.action_id = nb.action_id
ORDER BY pos.duration / nb.number_of_squares / square_area_km2;

CREATE INDEX ON public.analytics_surveillance_density_map (action_id);