ALTER TABLE regulatory_areas
    ADD COLUMN area double precision
        GENERATED ALWAYS AS (ST_Area(ST_Transform(geom, 3857))) STORED;