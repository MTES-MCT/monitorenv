
INSERT INTO themes_control_plan (id, theme) VALUES (100001, 'Mouillage Individuel');
INSERT INTO themes_control_plan (id, theme) VALUES (100002, 'Rejet');

INSERT INTO subthemes_control_plan (subtheme, allowed_tags, theme_id, year) VALUES ('Mouillage réglementé par arrêté', null, 100001, 2024);
INSERT INTO subthemes_control_plan (subtheme, allowed_tags, theme_id, year) VALUES ('Mouillage réglementé par AMP', null, 100001, 2024);
INSERT INTO subthemes_control_plan (subtheme, allowed_tags, theme_id, year) VALUES ('Mouillage avec AOT individuelle', null, 100001, 2024);
INSERT INTO subthemes_control_plan (subtheme, allowed_tags, theme_id, year) VALUES ('Autre mouillage', null, 100001, 2024);
INSERT INTO subthemes_control_plan (subtheme, allowed_tags, theme_id, year) VALUES ('Jet de déchet (macro déchet)', null, 100002, 2024);

INSERT INTO subthemes_control_plan (subtheme, allowed_tags, theme_id, year)
    SELECT 'Destruction, capture, arrachage', null, id, 2024
        FROM themes_control_plan
        WHERE theme = 'Police des espèces protégées et de leurs habitats (faune et flore)';

INSERT INTO subthemes_control_plan (subtheme, allowed_tags, theme_id, year)
    SELECT 'Atteinte aux habitats d’espèces protégées',
           '{"Oiseaux", "Faune", "Flore", "Autres espèces protégées", "Reptiles", "Mammifères marins"}',
           id,
           2024
        FROM themes_control_plan
        WHERE theme = 'Police des espèces protégées et de leurs habitats (faune et flore)';

