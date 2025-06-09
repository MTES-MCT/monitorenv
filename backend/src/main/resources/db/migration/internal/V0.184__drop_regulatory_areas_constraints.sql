ALTER TABLE tags_regulatory_areas
    DROP CONSTRAINT tags_regulatory_areas_regulatory_areas_id_fkey;
ALTER TABLE tags_regulatory_areas
    DROP CONSTRAINT tags_regulatory_areas_tags_id_fkey;

ALTER TABLE themes_regulatory_areas
    DROP CONSTRAINT themes_regulatory_areas_regulatory_areas_id_fkey;
ALTER TABLE themes_regulatory_areas
    DROP CONSTRAINT themes_regulatory_areas_themes_id_fkey;