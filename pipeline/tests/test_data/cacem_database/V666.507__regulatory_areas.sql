CREATE SCHEMA IF NOT EXISTS prod;
DROP TABLE IF EXISTS prod.reg_cacem CASCADE;

CREATE TABLE IF NOT EXISTS prod.reg_cacem
(
    id                      serial primary key,
    geom                    geometry(MultiPolygon, 4326),
    url                     character varying,
    layer_name              character varying,
    facade                  character varying,
    ref_reg                 character varying,
    creation                character varying,
    edition_bo              date,
    edition_cacem           date,
    editeur                 character varying,
    source                  character varying,
    observation             character varying,
    thematique              character varying,
    date                    date,
    duree_validite          character varying,
    date_fin                date,
    temporalite             character varying,
    type                    character varying,
    resume                  text,
    poly_name               text,
    plan                    text,
    authorization_periods   character varying,
    prohibition_periods     character varying,
    others_ref_reg          jsonb
);

INSERT INTO prod.reg_cacem (
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
    plan,
    authorization_periods,
    prohibition_periods,
    others_ref_reg
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
    'plan1',
    'période d''autorisation1',
    'période de prohibition1',
    null
);

INSERT INTO prod.reg_cacem (
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
    plan,
    authorization_periods,
    prohibition_periods,
    others_ref_reg
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
    '2025-07-01', /* edition_bo */
    'resume2',
    'poly_name2',
    'plan2',
    'période d''autorisation2',
    'période de prohibition2',
    null
);


/* NEW REGULATORY AREAS */
INSERT INTO prod.reg_cacem (
    id,
    geom,
    ref_reg  
) VALUES (
    3,
    'MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))',
    'ref_reg3'
);

INSERT INTO prod.reg_cacem (
    id,
    geom,
    ref_reg  
) VALUES (
    4,
    'MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))',
    'ref_reg4'
);
