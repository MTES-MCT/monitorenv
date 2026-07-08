UPDATE regulatory_areas ra
SET facade = (SELECT fas.facade
              FROM facade_areas_subdivided fas
              WHERE ST_Intersects(ra.geom, fas.geometry)
              GROUP BY fas.facade
              ORDER BY SUM(
                               ST_Area(
                                       ST_Intersection(ra.geom, fas.geometry)::geography
                               )
                       ) DESC
              LIMIT 1)
WHERE ra.geom IS NOT NULL;

UPDATE vigilance_areas va
SET sea_front = (SELECT fas.facade
                 FROM facade_areas_subdivided fas
                 WHERE ST_Intersects(va.geom, fas.geometry)
                 GROUP BY fas.facade
                 ORDER BY SUM(
                                  ST_Area(
                                          ST_Intersection(va.geom, fas.geometry)::geography
                                  )
                          ) DESC
                 LIMIT 1)
WHERE va.geom IS NOT NULL;

UPDATE missions m
SET facade = (SELECT fas.facade
              FROM facade_areas_subdivided fas
              WHERE ST_Intersects(m.geom, fas.geometry)
              GROUP BY fas.facade
              ORDER BY SUM(
                               ST_Area(
                                       ST_Intersection(m.geom, fas.geometry)::geography
                               )
                       ) DESC
              LIMIT 1)
where m.start_datetime_utc::TIMESTAMPTZ >= '2026-01-01T00:00:00'
  AND m.geom IS NOT NULL;

UPDATE env_actions e
SET facade = (SELECT fas.facade
              FROM facade_areas_subdivided fas
              WHERE ST_Intersects(e.geom, fas.geometry)
              GROUP BY fas.facade
              ORDER BY SUM(
                               ST_Area(
                                       ST_Intersection(e.geom, fas.geometry)::geography
                               )
                       ) DESC
              LIMIT 1)
where e.action_start_datetime_utc::TIMESTAMPTZ >= '2026-01-01T00:00:00'
  AND e.geom IS NOT NULL;


UPDATE reportings r
SET sea_front = (SELECT fas.facade
                 FROM facade_areas_subdivided fas
                 WHERE ST_Intersects(r.geom, fas.geometry)
                 GROUP BY fas.facade
                 ORDER BY SUM(
                                  ST_Area(
                                          ST_Intersection(r.geom, fas.geometry)::geography
                                  )
                          ) DESC
                 LIMIT 1)
where r.created_at::TIMESTAMPTZ >= '2026-01-01T00:00:00'
  AND r.geom IS NOT NULL;