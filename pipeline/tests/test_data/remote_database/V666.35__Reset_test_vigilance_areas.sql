-- Supprimer les données des tables dépendantes
DELETE FROM dashboard_datas;

DELETE FROM themes_vigilance_areas;

DELETE FROM tags_vigilance_areas;

DELETE FROM vigilance_areas;

INSERT INTO
  public.vigilance_areas (
    id,
    geom,
    sea_front
  )
VALUES
  (
    1,
    'MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))',
    'MED'
  );
