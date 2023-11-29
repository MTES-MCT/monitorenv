
INSERT INTO control_plan_themes (id, theme) VALUES (100001, 'Mouillage Individuel');
INSERT INTO control_plan_themes (id, theme) VALUES (100002, 'Rejet');

INSERT INTO control_plan_subthemes (subtheme, allowed_tags, theme_id, year) VALUES ('Mouillage réglementé par arrêté', null, 100001, 2024);
INSERT INTO control_plan_subthemes (subtheme, allowed_tags, theme_id, year) VALUES ('Mouillage réglementé par AMP', null, 100001, 2024);
INSERT INTO control_plan_subthemes (subtheme, allowed_tags, theme_id, year) VALUES ('Mouillage avec AOT individuelle', null, 100001, 2024);
INSERT INTO control_plan_subthemes (subtheme, allowed_tags, theme_id, year) VALUES ('Autre mouillage', null, 100001, 2024);
INSERT INTO control_plan_subthemes (subtheme, allowed_tags, theme_id, year) VALUES ('Jet de déchet (macro déchet)', null, 100002, 2024);

INSERT INTO control_plan_subthemes (subtheme, allowed_tags, theme_id, year)
    SELECT 'Destruction, capture, arrachage', null, id, 2024
        FROM control_plan_themes
        WHERE theme = 'Police des espèces protégées et de leurs habitats (faune et flore)';

INSERT INTO control_plan_subthemes (subtheme, allowed_tags, theme_id, year)
    SELECT 'Atteinte aux habitats d’espèces protégées',
           '{"Oiseaux", "Faune", "Flore", "Autres espèces protégées", "Reptiles", "Mammifères marins"}',
           id,
           2024
        FROM control_plan_themes
        WHERE theme = 'Police des espèces protégées et de leurs habitats (faune et flore)';

