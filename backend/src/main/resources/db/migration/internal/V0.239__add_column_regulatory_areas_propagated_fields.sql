-- Fields of a regulatory areas group applied by default to the regulatory areas of the group
ALTER TABLE regulatory_areas
    ADD COLUMN propagated_fields text[] NOT NULL DEFAULT '{}';
