ALTER TABLE regulatory_areas
    ADD COLUMN geom_3857 geometry(Geometry, 3857)
        GENERATED ALWAYS AS (ST_Transform(geom, 3857)) STORED;

CREATE INDEX ON regulatory_areas USING GIST (geom_3857);