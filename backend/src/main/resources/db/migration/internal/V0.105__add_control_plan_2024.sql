INSERT INTO control_plan_themes (id, theme) VALUES 
(100,'Mouillage individuel'),
(101,'Zone de mouillage et d''équipement léger (ZMEL)'),
(102,'Rejet'),
(103,'Espèce protégée et leur habitat (faune et flore)'),
(104,'Bien culturel maritime'),
(105,'Épave'),
(107,'Domanialité publique (circulation et dégradation)'),
(108,'Culture marine'),
(111,'Parc national'),
(112,'Réserve naturelle'),
(113,'Arrêté de protection'),
(114,'Autres'),
(116,'Pêche de loisir (autre que PAP)'),
(117,'Surveillance générale');

-- (106,'Activité et manifestation soumises à évaluation d’incidence Natura 2000'),
-- (109,'Travaux en milieu marin'),
-- (110,'Arrêté à visa environnemental'),
-- (115,'Pêche à pied'),

SELECT setval('control_plans_themes_id_seq', (SELECT max(id) FROM control_plan_themes), true);

INSERT INTO control_plan_tags (id,theme_id,tag) VALUES 
(10,103,'Mammifères marins'),
(11,103,'Oiseaux'),
(12,103,'Reptiles'),
(13,103,'Poissons'),
(14,103,'Flore'),
(15,103,'Habitat'),
(16,103,'Autres espèces protégées');

INSERT INTO control_plan_tags (id,tag,theme_id)
  SELECT new_tags.*, existing_theme.id FROM (VALUES
    (17,'Bichique'),
    (18,'Civelle'),
    (19,'Filet fixe'),
    (20,'Autre')) as new_tags,
    (
    SELECT id FROM control_plan_themes
    WHERE theme = 'Pêche à pied') existing_theme;

SELECT setval('control_plan_tags_id_seq', (SELECT max(id) FROM control_plan_tags), true);


INSERT INTO control_plan_sub_themes (id,theme_id,subtheme,year) VALUES 
(100,100,'Mouillage réglementé par arrêté',2024),
(101,100,'Mouillage réglementé par AMP',2024),
(102,100,'Mouillage avec AOT individuelle',2024),
(103,100,'Autre mouillage individuel',2024),
(104,101,'Gestionnaire ZMEL',2024),
(105,101,'Usagers ZMEL',2024),
(106,101,'Autre (ZMEL)',2024),
(107,102,'Jet de déchet (macro déchet)',2024),
(108,102,'Carénage sauvage',2024),
(109,102,'Rejet d''eau grise / eau noire',2024),
(110,102,'Rejet d''hydrocarbure',2024),
(111,102,'Eaux de ballast',2024),
(112,102,'Pollutions associées aux opérations d''exploration, d''exploitation, d''immersion et d''incinération',2024),
(113,102,'Rejets atmosphériques ',2024),
(114,102,'Avitaillement, soutage, transbordement',2024),
(115,102,'Rejet réglementé par AMP',2024),
(116,102,'Autre rejet',2024),
(117,103,'Destruction, capture, arrachage d''espèces protégées',2024),
(118,103,'Atteinte aux habitats d''espèces protégées',2024),
(119,103,'Transport, vente, exportation, commerce d''espèces protégées',2024),
(120,103,'Détention des espèces protégées',2024),
(121,103,'Dérogations relatives aux espèces protégées et aux habitats d''espèces protégées',2024),
(122,103,'Dérangement / perturbation intentionnelle des espèces animales protégées',2024),
(123,103,'Autre (Espèce protégée et leur habitat)',2024),
(124,104,'Prospection d''un bien culturel maritime',2024),
(125,104,'Aliénation/acquisition d''un bien culturel maritime',2024),
(126,104,'Déplacement/prélèvement/atteinte d''un bien culturel maritime',2024),
(127,104,'Autre (Bien culturel maritime)',2024),
(128,105,'Découverte d''une épave maritime',2024),
(129,105,'Recel ou détournement d''une épave maritime',2024),
(130,105,'Épave / Navire abandonné',2024),
(131,105,'Autre (Épave)',2024),
(137,107,'Circulation des VTM sur le DPM',2024),
(138,107,'Respect des espaces balisés',2024),
(139,107,'Dégradation du DPM',2024),
(140,107,'Autre (DPM)',2024),
(141,108,'Prescriptions réglementaires des concessions d''exploitation de culture marine',2024),
(142,108,'Remise en état après occupation du DPM',2024),
(143,108,'Implantation',2024),
(144,108,'Autre (Culture marine)',2024),
(156,111,'Réglementation du parc national',2024),
(157,111,'Autre (Parc national)',2024),
(158,112,'Réglementation de la réserve naturelle',2024),
(159,112,'Autre (Réserve naturelle)',2024),
(160,113,'Réglementation de l''arrêté de protection',2024),
(161,113,'Autre (Arrêté de protection)',2024),
(162,114,'Drone',2024),
(163,114,'Introduction d''espèce dans le milieu naturel ',2024),
(164,114,'Dérogation d''introduction d''espèce',2024),
(165,114,'Campagnes scientifiques',2024),
(166,114,'Manifestation sur le DPM avec prescriptions environnementales',2024),
(167,114,'Chasse sur le DPM',2024),
(168,114,'Autre',2024),
(173,116,'Pêche embarquée',2024),
(174,116,'Pêche sous-marine',2024),
(175,116,'Engin non-marqué',2024),
(176,116,'Autre (Pêche de loisir hors PAP)',2024),
(177,117,'Surveillance générale',2024)
;


INSERT INTO control_plan_sub_themes (id,subtheme,year,theme_id)
  SELECT new_sub_themes.*, existing_theme.id FROM (VALUES
  (132,'Existence d''une évaluation d''incidence Natura 2000',2024),
  (133,'Prescriptions environnementales des manifestations / activités dans une zone Natura 2000',2024),
  (134,'Travaux dans une zone Natura 2000',2024),
  (135,'Charte Natura 2000',2024),
  (136,'Autre (EIN2000)',2024)) as new_sub_themes,
    (
    SELECT id FROM control_plan_themes
        WHERE theme = 'Activités et manifestations soumises à évaluation d’incidence Natura 2000') existing_theme
;


INSERT INTO control_plan_sub_themes (id,subtheme,year,theme_id)
  SELECT new_sub_themes.*, existing_theme.id FROM (VALUES
  (145,'Dragage',2024),
  (146,'Clapage',2024),
  (147,'Extraction de granulats ',2024),
  (148,'Chantier marin',2024),
  (149,'Chantier portuaire',2024),
  (150,'Travaux réglementés par AMP',2024),
  (151,'Autres travaux en mer',2024)) as new_sub_themes,
    (
    SELECT id FROM control_plan_themes
        WHERE theme = 'Travaux en milieu marin') existing_theme
;


INSERT INTO control_plan_sub_themes (id,subtheme,year,theme_id)
  SELECT new_sub_themes.*, existing_theme.id FROM (VALUES
  (152,'Arrêtés municipaux réglementant certaines activités avec un impact sur l''environnement marin ',2024),
  (153,'Arrêtés du préfet de département réglementant certaines activités avec un impact sur l''environnement marin',2024),
  (154,'Arrêtés du préfet maritime réglementant certaines activités avec un impact sur l''environnement marin ',2024),
  (155,'Autres arrêtés réglementant certaines activités avec un impact sur l''environnement marin ',2024)
) as new_sub_themes,
    (
    SELECT id FROM control_plan_themes
        WHERE theme = 'Arrêté à visa environnemental') existing_theme
;

INSERT INTO control_plan_sub_themes (id,subtheme,year,theme_id)
  SELECT new_sub_themes.*, existing_theme.id FROM (VALUES
  (169,'Pêche à pied de loisir',2024),
  (170,'Pêche à pied professionnelle',2024),
  (171,'Engin non-marqué',2024),
  (172,'Autre (Pêche à pied)',2024)
) as new_sub_themes,
    (
    SELECT id FROM control_plan_themes
        WHERE theme = 'Pêche à pied') existing_theme
;


SELECT setval('control_plan_sub_themes_id_seq', (SELECT max(id) FROM control_plan_sub_themes), true);