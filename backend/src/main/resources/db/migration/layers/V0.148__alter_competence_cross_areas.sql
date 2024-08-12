ALTER TABLE competence_cross_areas
    ADD COLUMN geom2D geometry(LineString, 4326);

UPDATE competence_cross_areas
set geom2D = St_Force2D(geom)
WHERE geom IS NOT NULL;

ALTER TABLE competence_cross_areas
    DROP COLUMN geom;

ALTER TABLE competence_cross_areas
    RENAME COLUMN geom2D to geom;
