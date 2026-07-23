CREATE TYPE regulatory_areas_type AS ENUM ('ZONE', 'GROUP');

CREATE TABLE regulatory_areas_group
(
    regulatory_area_id INT REFERENCES regulatory_areas (id),
    group_id           INT REFERENCES regulatory_areas (id)
);
ALTER TABLE regulatory_areas
    ADD COLUMN area_type regulatory_areas_type default 'ZONE',
    ADD COLUMN location  VARCHAR;
WITH original_areas AS MATERIALIZED (SELECT id, layer_name, geom
                                     FROM regulatory_areas),
     grouped_reg AS (SELECT layer_name,
                            ST_Multi(
                                    ST_CollectionExtract(
                                            ST_Collect(ST_CollectionExtract(geom, 3)),
                                            3
                                    )
                            ) AS geom
                     FROM regulatory_areas
                     GROUP BY layer_name),
     base_id AS (SELECT GREATEST(COALESCE(MAX(id), 0), 999999) AS base_id
                 FROM regulatory_areas),
     new_groups AS (
         INSERT INTO regulatory_areas (id, area_type, layer_name, geom, creation)
             SELECT ids.id,
                    'GROUP',
                    ids.layer_name,
                    ids.geom,
                    now()
             FROM (SELECT base_id + ROW_NUMBER() OVER (ORDER BY gr.layer_name) AS id,
                          gr.layer_name,
                          gr.geom
                   FROM grouped_reg gr
                            CROSS JOIN base_id) ids
             RETURNING id, layer_name)
INSERT
INTO regulatory_areas_group (regulatory_area_id, group_id)
SELECT o.id,
       g.id
FROM original_areas o
         JOIN new_groups g
              ON g.layer_name = o.layer_name;