-- Supprimer les données des tables dépendantes
DELETE FROM dashboard_datas;

DELETE FROM themes_regulatory_areas_new;
DELETE FROM tags_regulatory_areas_new;
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
    type,
    date,
    date_fin,
    edition_cacem,
    edition_bo,
    resume,
    poly_name,
    plan,
    authorization_periods,
    prohibition_periods,
    additional_ref_reg
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
    'type1',
    '2025-01-01', /* date */
    '2025-12-31', /* date_fin */
    '2025-06-06', /* edition_cacem */
    '2025-01-10', /* edition_bo */
    'resume1',
    'poly_name1 qui est différent du CACEM',
    'plan1',
    'période d''autorisation1',
    'période de prohibition1',
    '[{"id": "55a403ba-3077-40aa-8241-967be5314b8c", "refReg": "Arrêté interpréfectoral du 22 décembre..."}]'
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
    type,
    date,
    date_fin,
    edition_cacem,
    edition_bo,
    resume,
    poly_name,
    plan,
    authorization_periods,
    prohibition_periods,
    additional_ref_reg
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
    'type2',
    '2025-01-12', /* date */
    '2026-04-12', /* date_fin */
    '2025-01-13', /* edition_cacem */
    '2025-07-21', /* edition_bo */
    'resume2',
    'poly_name2 qui est différent du CACEM',
    'plan2',
    'période d''autorisation2',
    'période de prohibition2',
    null
);


INSERT INTO themes_regulatory_areas_new (regulatory_areas_id, themes_id) VALUES(1, 101);
INSERT INTO themes_regulatory_areas_new (regulatory_areas_id, themes_id) VALUES(1, 296);