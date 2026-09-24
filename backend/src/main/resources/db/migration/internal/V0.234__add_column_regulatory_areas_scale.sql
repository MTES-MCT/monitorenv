CREATE TYPE regulatory_area_scale AS ENUM ('CUSTOM', 'PARC_AND_RESERVE', 'REGIONAL', 'NATIONAL');

ALTER TABLE regulatory_areas
    ADD COLUMN scale regulatory_area_scale;

