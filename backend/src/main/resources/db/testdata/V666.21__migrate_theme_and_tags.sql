INSERT INTO themes_reportings (reportings_id, themes_id)
SELECT DISTINCT reporting.id, reporting.control_plan_theme_id
FROM public.reportings reporting
WHERE NOT EXISTS (SELECT 1
                  FROM themes_reportings tr
                  WHERE tr.reportings_id = reporting.id
                    AND tr.themes_id = reporting.control_plan_theme_id);

INSERT INTO themes_reportings (reportings_id, themes_id)
SELECT DISTINCT rcpst.reporting_id, t.id
FROM public.reportings_control_plan_sub_themes rcpst
         INNER JOIN control_plan_sub_themes cpst ON rcpst.subtheme_id = cpst.id
         INNER JOIN themes t ON t.control_plan_sub_themes_id = cpst.id
WHERE NOT EXISTS (SELECT 1
                  FROM themes_reportings tr
                  WHERE tr.reportings_id = rcpst.reporting_id
                    AND tr.themes_id = t.id);

-- INSERTING TAGS <-> VIGILANCES AREAS FROM CURRENT VIGILANCES AREAS
INSERT INTO tags_vigilance_areas (tags_id, vigilance_areas_id)
SELECT t.id, va.id
FROM vigilance_areas va
         INNER JOIN tags t ON t.name = ANY (va.themes)
WHERE NOT EXISTS (SELECT 1
                  FROM tags_vigilance_areas tva
                  WHERE tva.tags_id = t.id
                    AND tva.vigilance_areas_id = va.id);

-- INSERTING TAGS <-> REGULATIONS FROM CURRENT REGULATIONS
INSERT INTO tags_regulatory_areas (tags_id, regulatory_areas_id)
SELECT t.id, r.id
FROM regulations_cacem r
         INNER JOIN tags t ON t.name = ANY (string_to_array(r.thematique, ', '));

-- INSERTING SUBTAGS <-> REGULATIONS FROM RANDOM REGULATIONS
INSERT INTO tags_regulatory_areas (tags_id, regulatory_areas_id)
VALUES (10, 16),
       (5, 16),
       (9, 17),
       (10, 17);

INSERT INTO themes_regulatory_areas (themes_id, regulatory_areas_id)
VALUES (101, 16),
       (296, 16),
       (9, 17),
       (290, 17),
       (330, 17),
       (331, 17);

/* VIGILANCE AREAS */
/* Add SubtagMouillage1 Tag */
INSERT INTO tags_vigilance_areas (vigilance_areas_id, tags_id)
VALUES (7, 10), (7, 5);

/* Add SubtagMouillage2 Tag */
INSERT INTO tags_vigilance_areas (vigilance_areas_id, tags_id)
VALUES (1, 11), (1, 5);

/* Add SubtagPN2 Tag */
INSERT INTO tags_vigilance_areas (vigilance_areas_id, tags_id)
VALUES (3, 9), (4, 9);

