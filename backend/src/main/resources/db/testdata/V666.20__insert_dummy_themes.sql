-- INSERTING DEFAULT THEMES FROM ACTUAL REGULATIONS
INSERT INTO themes (name, ended_at)
SELECT DISTINCT trim(theme), '2030-12-31 00:00:00'::timestamp
FROM (SELECT unnest(string_to_array(thematique, ', ')) AS theme
      FROM regulations_cacem) t
WHERE trim(theme) NOT IN (SELECT name FROM themes);

-- INSERTING THEMES <-> REGULATIONS FROM ACTUAL REGULATIONS
INSERT INTO themes_regulations (themes_id, regulations_cacem_id)
SELECT t.id, r.id
FROM regulations_cacem r
         INNER JOIN themes t ON t.name = ANY (string_to_array(r.thematique, ', '));

-- INSERTING RANDOM SUBTHEMES
INSERT INTO sub_themes (themes_id, name, ended_at)
VALUES (1, 'subtheme1', '2024-01-01'::timestamp),
       (1, 'subtheme2', null),
       (5, 'subtheme1', '2030-01-01'::timestamp),
       (5, 'subtheme2', null)
