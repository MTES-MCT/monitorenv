-- INSERTING DEFAULT TAGS FROM CURRENT REGULATIONS
INSERT INTO tags (name, started_at, ended_at)
SELECT DISTINCT trim(tag), '2023-01-01 00:00:00'::timestamp, '2030-12-31 00:00:00'::timestamp
FROM (SELECT unnest(string_to_array(thematique, ', ')) AS tag
      FROM regulations_cacem) t
WHERE trim(tag) NOT IN (SELECT name FROM tags);

-- INSERTING RANDOM SUBTAGS
INSERT INTO tags (parent_id, name, started_at, ended_at)
VALUES (1, 'subtagPN1', '2023-01-01 00:00:00'::timestamp, '2024-01-01'::timestamp),
       (1, 'subtagPN2', '2023-01-01 00:00:00'::timestamp, null),
       (5, 'subtagMouillage1', '2023-01-01 00:00:00'::timestamp, '2030-01-01'::timestamp),
       (5, 'subtagMouillage2', '2023-01-01 00:00:00'::timestamp, null);
