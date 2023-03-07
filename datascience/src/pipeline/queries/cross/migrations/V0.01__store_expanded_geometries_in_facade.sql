-- Requête utilisée localement pour étendre les géométries des façades sans créer de zones d'overlap
-- Après avoir fait ces modifs localement, il reste à exécuter le flow `facade_areas` pour mettre à jour les
-- zones de façades sur la table distante.

DROP TABLE prod.facade_areas;

CREATE TABLE prod.facade_areas AS (
  WITH all_facades AS (
    SELECT ST_UNION(geom) as all_facades_geom
    FROM prod.facade_areas_new_unextended
  ),

  expanded_facades AS (
    SELECT
      facade,
      ST_Difference(
        ST_Buffer(geom, 0.1),
        ST_Difference(
          all_facades_geom,
          geom
        )
      ) AS expanded_geometry
    FROM prod.facade_areas_new_unextended
    CROSS JOIN all_facades
  ),

  other_expanded_facades AS (
    SELECT 
      f1.facade,
      ST_UNION(CASE WHEN f2.facade = f1.facade THEN NULL ELSE f2.expanded_geometry END) as other_expanded_facades_geom
    FROM expanded_facades f1
    CROSS JOIN expanded_facades f2
    GROUP BY f1.facade
  ),

  expanded_facades_without_overlap AS (
    SELECT
      ef.facade,
      ST_Difference(
        ef.expanded_geometry,
        other_expanded_facades_geom
      ) AS expanded_geometry
    FROM expanded_facades ef
    JOIN other_expanded_facades oef
    ON ef.facade = oef.facade
  )
  
SELECT 
  expanded_facades_without_overlap.facade,
  expanded_facades_without_overlap.expanded_geometry as geometry
FROM expanded_facades_without_overlap
);

CREATE INDEX sidx_facade_areas_geometry on prod.facade_areas using gist(geometry);

ALTER TABLE prod.facade_areas ADD column id serial;
ALTER TABLE prod.facade_areas ADD PRIMARY KEY (id);