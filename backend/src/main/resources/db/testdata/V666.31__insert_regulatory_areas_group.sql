WITH original_areas AS MATERIALIZED (
    -- Snapshot des zones existantes AVANT la création des groupes
    SELECT id, layer_name, geom
    FROM regulatory_areas),
     grouped_reg AS (SELECT layer_name,
                            ST_Multi(
                                    ST_CollectionExtract(
                                            ST_Collect(ST_CollectionExtract(geom, 3)),
                                            3
                                    )
                            ) AS geom
                     FROM regulatory_areas
                     WHERE layer_name IS NOT NULL
                     GROUP BY layer_name),
     new_groups AS (
         INSERT INTO regulatory_areas (area_type, layer_name, geom, creation)
             SELECT 'GROUP', layer_name, geom, now() FROM grouped_reg
             RETURNING id, layer_name)
INSERT
INTO regulatory_areas_group (regulatory_area_id, group_id)
SELECT o.id AS regulatory_area_id,
       g.id AS group_id
FROM original_areas o
         JOIN new_groups g ON g.layer_name = o.layer_name;