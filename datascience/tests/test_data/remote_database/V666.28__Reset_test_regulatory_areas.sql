-- Supprimer les données des tables dépendantes
DELETE FROM themes_regulatory_areas;
DELETE FROM tags_regulatory_areas;
DELETE FROM dashboard_datas;

DELETE FROM regulations_cacem;

insert into public.regulations_cacem (id, geom, entity_name, url, layer_name, facade, ref_reg, edition, editeur, source, observation, thematique, date, duree_validite, date_fin, temporalite, type, row_hash) values (1, 'MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))', 'entity_name1', 'url1', 'layer_name1', 'MED', 'ref_reg1', '2025-01-01', 'editrice1', 'source1', 'observation1', 'thematique1', '2010-06-01', '10 ans', '2024-01-01', 'temporaire', 'Décret', '4ccc708e6a0c4f311dd7e537e282f7f6');
insert into public.regulations_cacem (id, geom, entity_name, url, layer_name, facade, ref_reg, edition, editeur, source, observation, thematique, date, duree_validite, date_fin, temporalite, type, row_hash) values (2, 'MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))', 'entity_name2', 'url2', 'layer_name2', 'NAMO', 'ref_reg2', '2025-01-01', 'editeur2', 'source2', 'observation2', 'thematique2', '2005-07-01', '20 ans', '2025-01-01', 'permanent', 'Arrêté préfectoral', '8c3842144dfaf46ead39bfa628dd9513');