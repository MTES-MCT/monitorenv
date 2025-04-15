-- INSERTING DEFAULT TAGS FROM ACTUAL REGULATIONS
INSERT INTO tags (name, ended_at)
SELECT DISTINCT trim(tag), '2030-12-31 00:00:00'::timestamp
FROM (SELECT unnest(string_to_array(thematique, ', ')) AS tag
      FROM regulations_cacem) t
WHERE trim(tag) NOT IN (SELECT name FROM tags);

-- INSERTING TAGS <-> REGULATIONS FROM ACTUAL REGULATIONS
INSERT INTO tags_regulatory_area (tags_id, regulatory_area_id)
SELECT t.id, r.id
FROM regulations_cacem r
         INNER JOIN tags t ON t.name = ANY (string_to_array(r.thematique, ', '));

-- INSERTING RANDOM SUBTAGS
INSERT INTO tags (parent_id, name, ended_at)
VALUES (1, 'subtagPN1', '2024-01-01'::timestamp),
       (1, 'subtagPN2', null),
       (5, 'subtagMouillage1', '2030-01-01'::timestamp),
       (5, 'subtagMouillage2', null);

-- INSERTING SUBTAGS <-> REGULATIONS FROM RANDOM REGULATIONS
INSERT INTO tags_regulatory_area (tags_id, regulatory_area_id)
VALUES (10, 16),
       (9, 17);
