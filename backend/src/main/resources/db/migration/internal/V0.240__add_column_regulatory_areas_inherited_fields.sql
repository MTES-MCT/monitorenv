-- Fields for which a regulatory area uses the value of its group.
-- The group value is also written in the regulatory area columns (denormalized), so that all reads keep working.
ALTER TABLE regulatory_areas
    ADD COLUMN inherited_fields text[] NOT NULL DEFAULT '{}';
