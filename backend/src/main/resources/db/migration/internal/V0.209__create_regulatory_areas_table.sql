
CREATE TABLE public.regulatory_areas (
    id                      serial PRIMARY KEY,
    geom                    geometry(MultiPolygon,4326),
    url                     character varying,
    layer_name              character varying,
    facade                  character varying,
    ref_reg                 character varying,
    creation                TIMESTAMP,
    edition_bo              TIMESTAMP,
    edition_cacem           TIMESTAMP,
    editeur                 character varying,
    source                  character varying,
    observation             character varying,
    thematique              character varying,
    date                    TIMESTAMP,
    duree_validite          character varying,
    date_fin                TIMESTAMP,
    temporalite             character varying,
    type                    character varying,
    resume                  text,
    poly_name               text,
    plan                    text,
    authorization_periods   character varying,
    prohibition_periods     character varying,
    additional_ref_reg          jsonb
);

CREATE TABLE tags_regulatory_areas_new
(
    tags_id             INT REFERENCES tags (id),
    regulatory_areas_id INT REFERENCES regulatory_areas (id),
    primary key (tags_id, regulatory_areas_id)
);

CREATE TABLE themes_regulatory_areas_new
(
    themes_id           INT REFERENCES themes (id),
    regulatory_areas_id INT REFERENCES regulatory_areas (id),
    primary key (themes_id, regulatory_areas_id)
);



/* Insert data from old tables to new tables */
INSERT INTO regulatory_areas (
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
    creation,
    resume,
    plan,
    poly_name
)
SELECT
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
    date::timestamp,
    date_fin::timestamp,
    edition::timestamp AS creation,
    resume,
    plan,
    poly_name
FROM regulations_cacem;

INSERT INTO themes_regulatory_areas_new (
    themes_id,
    regulatory_areas_id
)
SELECT 
    themes_id,
    regulatory_areas_id
FROM themes_regulatory_areas;

INSERT INTO tags_regulatory_areas_new (
    tags_id,
    regulatory_areas_id
)
SELECT 
    tags_id,
    regulatory_areas_id
FROM tags_regulatory_areas;