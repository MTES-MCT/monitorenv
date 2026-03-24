ALTER TABLE themes_natinfs
    DROP CONSTRAINT themes_natinfs_natinf_code_fkey,
    DROP CONSTRAINT themes_natinfs_themes_id_fkey;

ALTER TABLE themes_natinfs
    ADD CONSTRAINT themes_natinfs_natinf_code_fkey FOREIGN KEY (natinf_code) REFERENCES natinfs (natinf_code) ON DELETE CASCADE,
    ADD CONSTRAINT themes_natinfs_themes_id_fkey FOREIGN KEY (themes_id) REFERENCES themes (id) ON DELETE CASCADE;