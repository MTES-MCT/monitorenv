/* INSERT INTO control_plan_themes (id, theme) VALUES 
(100,'Mouillage individuel'),
(101,'Zone de mouillage et d''équipement léger (ZMEL)'),
(102,'Rejet'),
(103,'Espèce protégée et leur habitat (faune et flore)'),
(104,'Bien culturel maritime'),
(105,'Épave'),
(106,'Domanialité publique (circulation et dégradation)'),
(107,'Culture marine'),
(108,'Parc national'),
(109,'Réserve naturelle'),
(110,'Arrêté de protection'),
(111,'Autres'),
(112,'Pêche de loisir (autre que PAP)'),
(113,'Surveillance générale');
 */
-- Thématiques existantes pour lesquels une recherche doit être faite pour récupérer l'identifiant
-- Activité et manifestation soumises à évaluation d’incidence Natura 2000
-- Travaux en milieu marin
-- Arrêté à visa environnemental
-- Pêche à pied

/* SELECT setval('control_plan_themes_id_seq', (SELECT max(id) FROM control_plan_themes), true);

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

 */
INSERT INTO control_plan_sub_themes (id,theme_id,subtheme,year) VALUES 
(178,100,'Mouillage réglementé par arrêté',2025),
(179,100,'Mouillage réglementé par AMP',2025),
(180,100,'Mouillage avec AOT individuelle',2025),
(181,100,'Autre mouillage individuel',2025),
(182,101,'Gestionnaire ZMEL',2025),
(183,101,'Usagers ZMEL',2025),
(184,101,'Autre (ZMEL)',2025),
(185,102,'Jet de déchet (macro déchet)',2025),
(186,102,'Carénage sauvage',2025),
(187,102,'Rejet d''eau grise / eau noire',2025),
(188,102,'Rejet d''hydrocarbure',2025),
(189,102,'Eaux de ballast',2025),
(190,102,'Pollutions associées aux opérations d''exploration, d''exploitation, d''immersion et d''incinération',2025),
(191,102,'Rejets atmosphériques ',2025),
(192,102,'Avitaillement, soutage, transbordement',2025),
(193,102,'Rejet réglementé par AMP',2025),
(194,102,'Autre rejet',2025),
(195,103,'Destruction, capture, arrachage d''espèces protégées',2025),
(196,103,'Atteinte aux habitats d''espèces protégées',2025),
(197,103,'Transport, vente, exportation, commerce d''espèces protégées',2025),
(198,103,'Détention des espèces protégées',2025),
(199,103,'Dérogations relatives aux espèces protégées et aux habitats d''espèces protégées',2025),
(200,103,'Dérangement / perturbation intentionnelle des espèces animales protégées',2025),
(201,103,'Autre (Espèce protégée et leur habitat)',2025),
(202,104,'Prospection d''un bien culturel maritime',2025),
(203,104,'Aliénation/acquisition d''un bien culturel maritime',2025),
(204,104,'Déplacement/prélèvement/atteinte d''un bien culturel maritime',2025),
(205,104,'Autre (Bien culturel maritime)',2025),
(206,105,'Découverte d''une épave maritime',2025),
(207,105,'Recel ou détournement d''une épave maritime',2025),
(208,105,'Épave / Navire abandonné',2025),
(209,105,'Autre (Épave)',2025),
(210,106,'Circulation des VTM sur le DPM',2025),
(211,106,'Respect des espaces balisés',2025),
(212,106,'Dégradation du DPM',2025),
(213,106,'Autre (DPM)',2025),
(214,107,'Prescriptions réglementaires des concessions d''exploitation de culture marine',2025),
(215,107,'Remise en état après occupation du DPM',2025),
(216,107,'Implantation',2025),
(217,107,'Autre (Culture marine)',2025),
(218,108,'Réglementation du parc national',2025),
(219,108,'Autre (Parc national)',2025),
(220,109,'Autre (Réserve naturelle)',2025),
(221,110,'Réglementation de l''arrêté de protection',2025),
(222,110,'Autre (Arrêté de protection)',2025),
(223,111,'Drone',2025),
(224,111,'Introduction d''espèce dans le milieu naturel ',2025),
(225,111,'Dérogation d''introduction d''espèce',2025),
(226,111,'Campagnes scientifiques',2025),
(227,111,'Manifestation sur le DPM avec prescriptions environnementales',2025),
(228,111,'Chasse sur le DPM',2025),
(229,111,'Autre',2025),
(230,112,'Pêche embarquée',2025),
(231,112,'Pêche sous-marine',2025),
(232,112,'Engin non-marqué',2025),
(233,112,'Autre (Pêche de loisir hors PAP)',2025),
(234,113,'Surveillance générale',2025)
;


/* INSERT INTO control_plan_sub_themes (id,subtheme,year,theme_id)
  SELECT new_sub_themes.*, existing_theme.id FROM (VALUES
  (132,'Existence d''une évaluation d''incidence Natura 2000',2025),
  (133,'Prescriptions environnementales des manifestations / activités dans une zone Natura 2000',2025),
  (134,'Travaux dans une zone Natura 2000',2025),
  (135,'Charte Natura 2000',2025),
  (136,'Autre (EIN2000)',2025)) as new_sub_themes,
    (
    SELECT id FROM control_plan_themes
        WHERE theme = 'Activités et manifestations soumises à évaluation d’incidence Natura 2000') existing_theme
;


INSERT INTO control_plan_sub_themes (id,subtheme,year,theme_id)
  SELECT new_sub_themes.*, existing_theme.id FROM (VALUES
  (145,'Dragage',2025),
  (146,'Clapage',2025),
  (147,'Extraction de granulats ',2025),
  (148,'Chantier marin',2025),
  (149,'Chantier portuaire',2025),
  (150,'Travaux réglementés par AMP',2025),
  (151,'Autres travaux en mer',2025)) as new_sub_themes,
    (
    SELECT id FROM control_plan_themes
        WHERE theme = 'Travaux en milieu marin') existing_theme
;


INSERT INTO control_plan_sub_themes (id,subtheme,year,theme_id)
  SELECT new_sub_themes.*, existing_theme.id FROM (VALUES
  (152,'Arrêtés municipaux réglementant certaines activités avec un impact sur l''environnement marin ',2025),
  (153,'Arrêtés du préfet de département réglementant certaines activités avec un impact sur l''environnement marin',2025),
  (154,'Arrêtés du préfet maritime réglementant certaines activités avec un impact sur l''environnement marin ',2025),
  (155,'Autres arrêtés réglementant certaines activités avec un impact sur l''environnement marin ',2025)
) as new_sub_themes,
    (
    SELECT id FROM control_plan_themes
        WHERE theme = 'Arrêté à visa environnemental') existing_theme
;

INSERT INTO control_plan_sub_themes (id,subtheme,year,theme_id)
  SELECT new_sub_themes.*, existing_theme.id FROM (VALUES
  (169,'Pêche à pied de loisir',2025),
  (170,'Pêche à pied professionnelle',2025),
  (171,'Engin non-marqué',2025),
  (172,'Autre (Pêche à pied)',2025)
) as new_sub_themes,
    (
    SELECT id FROM control_plan_themes
        WHERE theme = 'Pêche à pied') existing_theme
;


SELECT setval('control_plan_sub_themes_id_seq', (SELECT max(id) FROM control_plan_sub_themes), true); */