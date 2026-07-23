CREATE SCHEMA IF NOT EXISTS prod;
DROP TABLE IF EXISTS prod.reg_cacem CASCADE;

CREATE TABLE IF NOT EXISTS prod.reg_cacem
(
    id                              serial primary key,
    geom                            geometry(MultiPolygon, 4326),
    url                             character varying,
    layer_name                      character varying,
    facade                          character varying,
    ref_reg                         character varying,
    creation                        character varying,
    edition_bo                      date,
    edition_cacem                   date,
    editeur                         character varying,
    source                          character varying,
    observation                     character varying,
    date                            date,
    date_fin                        date,
    type                            character varying,
    resume                          text,
    poly_name                       text,
    plan                            text,
    authorization_periods           character varying,
    prohibition_periods             character varying,
    additional_ref_reg              jsonb,
    themes                          character varying,
    tags                            character varying,
    location                        character varying,
    area_type                       character varying default 'ZONE'

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
    additional_ref_reg,
    themes,
    tags,
    location
) VALUES (
    1,
    'MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))',
    'url1',        
    'layer_name1',
    'MED',
    'ref_reg1_edited',
    'editeur1',
    'source1',
    'obs1',
    'type1',
    '2025-01-01 00:00:00', /* date */
    '2025-12-31 00:00:00', /* date_fin */
    '2025-06-06 00:00:00', /* edition_cacem */
    '2025-01-10 00:00:00', /* edition_bo */
    'resume1',
    'poly_name1',
    'plan1',
    'période d''autorisation1',
    'période de prohibition1',
    '[{"id": "55a403ba-3077-40aa-8241-967be5314b8c", "refReg": "Arrêté interpréfectoral du 22 décembre..."}]',
    'AMP sans réglementation particulière,Pêche à pied',
    'tag1,tag2',
    'location1'
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
