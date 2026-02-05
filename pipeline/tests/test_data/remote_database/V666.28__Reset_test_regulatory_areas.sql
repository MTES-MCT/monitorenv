-- Supprimer les données des tables dépendantes
DELETE FROM themes_regulatory_areas;
DELETE FROM tags_regulatory_areas;
DELETE FROM dashboard_datas;

DELETE FROM regulations_cacem;

INSERT INTO public.regulations_cacem (id, geom, url, layer_name, facade, ref_reg, edition, editeur, source, observation, thematique, date, duree_validite, date_fin, temporalite, type, plan, poly_name, resume, row_hash) values (1, 'MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))', 'url1', 'layer_name1', 'MED', 'ref_reg1', '2025-01-01', 'editrice1', 'source1', 'observation1', 'thematique1', '2010-06-01', '10 ans', '2024-01-01', 'temporaire', 'Décret', 'PIRC', 'poly_name1', 'resume1', '4ccc708e6a0c4f311dd7e537e282f7f6');
INSERT INTO public.regulations_cacem (id, geom, url, layer_name, facade, ref_reg, edition, editeur, source, observation, thematique, date, duree_validite, date_fin, temporalite, type, plan, poly_name, resume, row_hash) values (2, 'MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))', 'url2', 'layer_name2', 'NAMO', 'ref_reg2', '2025-01-01', 'editeur2', 'source2', 'observation2', 'thematique2', '2005-07-01', '20 ans', '2025-01-01', 'permanent', 'Arrêté préfectoral', 'PSCEM', 'poly_name2', 'resume2', '8c3842144dfaf46ead39bfa628dd9513');

DELETE FROM regulatory_areas;

INSERT INTO public.regulatory_areas (
    id,
    geom,
    url,        
    layer_name,
    facade,
    ref_reg,
    editeur,
    source,
    observation,
    thematique,
    duree_validite,
    temporalite,
    type,
    date,
    date_fin,
    edition_cacem,
    edition_bo,
    resume,
    poly_name,
    plan
) VALUES (
    1,
    'MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))',
    'url1',        
    'layer_name1',
    'MED',
    'ref_reg1',
    'editeur1',
    'source1',
    'obs1',
    'thematique1',
    'validite1',
    'tempo1',
    'type1',
    '2025-01-01', /* date */
    '2025-12-31', /* date_fin */
    '2025-06-06', /* edition_cacem */
    '2025-01-10', /* edition_bo */
    'resume1',
    'poly_name1',
    'plan1'
);

INSERT INTO public.regulatory_areas (
    id,
    geom,
    url,        
    layer_name,
    facade,
    ref_reg,
    editeur,
    source,
    observation,
    thematique,
    duree_validite,
    temporalite,
    type,
    date,
    date_fin,
    edition_cacem,
    edition_bo,
    resume,
    poly_name,
    plan    
) VALUES (
    2,
    'MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))',
    'url2',        
    'layer_name2',
    'NAMO',
    'ref_reg2',
    'editeur2',
    'source2',
    'obs2',
    'thematique2',
    'validite2',
    'tempo2',
    'type2',
    '2025-01-12', /* date */
    '2026-04-12', /* date_fin */
    '2025-01-13', /* edition_cacem */
    '2025-07-21', /* edition_bo */
    'resume2',
    'poly_name2',
    'plan2'
);


