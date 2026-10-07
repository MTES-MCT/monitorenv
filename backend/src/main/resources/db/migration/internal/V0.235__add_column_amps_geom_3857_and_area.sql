ALTER TABLE amp_cacem
    ADD COLUMN geom_3857 geometry(Geometry, 3857)
        GENERATED ALWAYS AS (ST_Transform(geom, 3857)) STORED,
    ADD COLUMN area      double precision
        GENERATED ALWAYS AS (ST_Area(ST_Transform(geom, 3857))) STORED;

CREATE INDEX ON amp_cacem USING GIST (geom_3857);