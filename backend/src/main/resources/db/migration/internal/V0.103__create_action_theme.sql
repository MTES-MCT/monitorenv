-- Création des tables

CREATE TABLE control_plan_themes (
    id serial PRIMARY KEY,
    theme text UNIQUE NOT NULL
);

CREATE TABLE control_plan_subthemes (
    id serial PRIMARY KEY,
    subtheme text,
    theme_id int REFERENCES control_plan_themes(id),
    year int
);
CREATE INDEX idx_control_plan_subthemes_year ON control_plan_subthemes USING btree(year);


CREATE TABLE control_plan_tags (
    id serial PRIMARY KEY,
    tag text,
    theme_id int REFERENCES control_plan_themes(id)
);

CREATE TABLE env_actions_control_plan_themes (
     env_action_id uuid,
     theme_id integer NOT NULL,
     foreign key (env_action_id) references env_actions(id),
     foreign key (theme_id) references control_plan_themes(id),
     primary key (env_action_id, theme_id)
);

CREATE TABLE env_actions_control_plan_sub_themes (
    env_action_id uuid,
    subtheme_id integer,
    foreign key (env_action_id) references env_actions(id),
    foreign key (subtheme_id) references control_plan_subthemes(id),
    primary key (env_action_id, subtheme_id)
);

CREATE TABLE env_actions_control_plan_tags (
  env_action_id uuid,
  tag_id integer,
  foreign key (env_action_id) references env_actions(id),
  foreign key (tag_id) references control_plan_tags(id),
  primary key (env_action_id, tag_id)
);

CREATE TABLE reportings_control_plan_sub_themes (
    id serial PRIMARY KEY,
    reporting_id integer,
    theme_id integer NOT NULL,
    subtheme_id integer,
    foreign key (reporting_id) references reportings(id),
    foreign key (theme_id) references control_plan_themes(id),
    foreign key (subtheme_id) references control_plan_subthemes(id),
    unique (reporting_id, theme_id, subtheme_id)
);

COMMENT ON TABLE reportings_control_plan_sub_themes IS 'Table de jointure entre les signalements et les sous-thèmes du plan de contrôle';
COMMENT ON TABLE control_plan_themes IS 'Table des thèmes du plan de contrôle';
COMMENT ON TABLE control_plan_subthemes IS 'Table des sous-thèmes du plan de contrôle versionnés par année';
COMMENT ON TABLE control_plan_tags IS 'Table des tags du plan de contrôle reliés aux thématiques';
COMMENT ON TABLE env_actions_control_plan_sub_themes IS 'Table de jointure entre les actions et les sous-thèmes du plan de contrôle';
COMMENT ON TABLE env_actions_control_plan_tags IS 'Table de jointure entre les actions et les tags reliées aux thématiques du plan de contrôle';

-- Insertion des themes et sous-themes à partir de la table control_themes
INSERT INTO control_plan_themes (theme)
    SELECT distinct theme_level_1 FROM control_themes ORDER BY theme_level_1
    ;

INSERT INTO control_plan_subthemes (subtheme, theme_id, year)
    SELECT distinct theme_level_2, t.id, 2023
        FROM control_themes c JOIN control_plan_themes t ON t.theme = theme_level_1
        WHERE theme_level_2 IS NOT NULL ORDER BY theme_level_2
;

INSERT INTO control_plan_tags (theme_id, tag)
    SELECT t.id, unnest(ARRAY['Oiseaux', 'Habitat', 'Flore', 'Autres espèces protégées', 'Reptiles', 'Mammifères marins'])
        FROM control_plan_themes t
        WHERE t.theme = 'Police des espèces protégées et de leurs habitats (faune et flore)'
;

-- EnvActions: Insertion des données depuis les env actions dans la table env_actions_control_plan_themes
INSERT INTO env_actions_control_plan_themes (env_action_id, theme_id)
WITH themes AS (
    SELECT
        id as env_action_id,
        jsonb_array_elements(value->'themes')->>'theme' as theme
FROM env_actions
    )
SELECT themes.env_action_id,  th.id
FROM themes,
     control_plan_themes th
WHERE  th.theme = themes.theme
;
-- EnvActions: Insertion des données depuis les env actions dans la table env_actions_control_plan_sub_themes
INSERT INTO env_actions_control_plan_sub_themes (env_action_id, subtheme_id)
    WITH themes AS (
        SELECT
            id as env_action_id,
            jsonb_array_elements(value->'themes')->>'theme' as theme,
            jsonb_array_elements_text(jsonb_array_elements(value->'themes')->'subThemes') as subtheme
        FROM env_actions
    )
    SELECT themes.env_action_id,  sbt.id
    FROM themes,
         control_plan_subthemes sbt,
         control_plan_themes th
    WHERE sbt.subtheme = themes.subtheme
      AND sbt.theme_id = th.id
      AND th.theme = themes.theme
      AND sbt.year = 2023;

-- EnvActions: Insertion des données depuis les env actions dans la table env_actions_control_plan_tags
INSERT INTO env_actions_control_plan_tags (env_action_id, tag_id)
WITH themes AS (
    SELECT
        id as env_action_id,
        jsonb_array_elements(value->'themes')->>'theme' as theme,
        jsonb_array_elements(value->'themes')->'protectedSpecies' as protectedspecies
    FROM env_actions
)
    SELECT themes.env_action_id,  control_plan_tags.id
        FROM themes,
            LATERAL (
                SELECT
                    CASE species
                        WHEN 'BIRDS' THEN 'Oiseaux'
                        WHEN 'HABITAT' THEN 'Habitat'
                        WHEN 'FLORA' THEN 'Flore'
                        WHEN 'OTHER' THEN 'Autres espèces protégées'
                        WHEN 'REPTILES' THEN 'Reptiles'
                        WHEN 'MARINE_MAMMALS' THEN 'Mammifères marins'
                        ELSE 'Non défini'
                        END
                FROM (SELECT jsonb_array_elements_text(protectedspecies) species) t
                    ) d(tags),
             control_plan_tags
        WHERE control_plan_tags.tag = d.tags;


--- Signalements
INSERT INTO reportings_control_plan_sub_themes (reporting_id, subtheme_id)
    WITH reportingthemes AS (
        SELECT id,
               theme,
               unnest(sub_themes) as subtheme
        FROM public.reportings r
        WHERE r.sub_themes is not null
    )
    SELECT rt.id, th.id
        FROM reportingthemes rt,
             public.control_plan_themes as th,
             public.control_plan_subthemes as sbt
        WHERE th.id = sbt.theme_id
            AND rt.theme = th.theme
            AND rt.subtheme = sbt.subtheme
            AND sbt.year = 2023
;
