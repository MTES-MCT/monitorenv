-- Migrating data to new table
INSERT INTO vigilance_areas_source (id, vigilance_areas_id, name)
    (SELECT DISTINCT uuid_generate_v4(), v.id, v.source
     FROM vigilance_areas v);

INSERT INTO vigilance_areas_source (id, vigilance_areas_id, control_unit_contacts_id)
        (SELECT DISTINCT uuid_generate_v4(), 1, 1);