
INSERT INTO control_plan_themes (id, theme) VALUES (100001, 'Mouillage Individuel');
INSERT INTO control_plan_themes (id, theme) VALUES (100002, 'Rejet');
INSERT INTO control_plan_themes (id, theme) VALUES (100003, 'Épave');

INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Mouillage réglementé par arrêté', 100001, 2024);
INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Mouillage réglementé par AMP', 100001, 2024);
INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Mouillage avec AOT individuelle', 100001, 2024);
INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Autre mouillage', 100001, 2024);
INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Rejet d’hydrocarbure', 100002, 2024);
INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Découverte d’une épave maritime', 100003, 2024);
INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Recel ou détournement d’une épave maritime', 100003, 2024);
INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Épave / Navire abandonné', 100003, 2024);
INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Autre (Épave)', 100003, 2024);


INSERT INTO control_plan_sub_themes (subtheme, theme_id, year)
    SELECT 'Destruction, capture, arrachage', id, 2024
        FROM control_plan_themes
        WHERE theme = 'Police des espèces protégées et de leurs habitats (faune et flore)';

INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Dérogations relatives aux espèces protégées et aux habitats d’espèces protégées', 11, 2024);
INSERT INTO control_plan_sub_themes (subtheme, theme_id, year) VALUES ('Détention des espèces protégées', 11, 2024);

