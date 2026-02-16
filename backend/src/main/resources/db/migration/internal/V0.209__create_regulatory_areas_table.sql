
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
    others_ref_reg          jsonb
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
