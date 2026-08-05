DELETE FROM regulatory_areas_group;
DELETE FROM regulatory_areas WHERE area_type = 'GROUP';

WITH original_areas AS MATERIALIZED (SELECT id, layer_name, location, geom
                                          FROM regulatory_areas),
     grouped_reg AS (SELECT layer_name,
                                location,
                            ST_Multi(
                                    ST_CollectionExtract(
                                            ST_Collect(ST_CollectionExtract(geom, 3)),
                                            3
                                    )
                            ) AS geom
                     FROM regulatory_areas
                        GROUP BY layer_name, location),
     base_id AS (SELECT GREATEST(COALESCE(MAX(id), 0), 999999) AS base_id
                 FROM regulatory_areas),
     new_groups AS (
          INSERT INTO regulatory_areas (id, area_type, layer_name, location, geom, creation)
             SELECT ids.id,
                    'GROUP',
                    ids.layer_name,
                      ids.location,
                    ids.geom,
                    now()
             FROM (SELECT base_id + ROW_NUMBER() OVER (ORDER BY gr.layer_name) AS id,
                          gr.layer_name,
                             gr.location,
                          gr.geom
                   FROM grouped_reg gr
                            CROSS JOIN base_id) ids
              RETURNING id, layer_name, location)
INSERT
INTO regulatory_areas_group (regulatory_area_id, group_id)
SELECT o.id,
       g.id
FROM original_areas o
         JOIN new_groups g
                ON g.layer_name = o.layer_name
                    AND g.location IS NOT DISTINCT FROM o.location;