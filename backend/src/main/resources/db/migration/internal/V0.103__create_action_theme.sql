-- Création des tables

CREATE TABLE control_plan_themes (
    id serial PRIMARY KEY,
    theme text UNIQUE NOT NULL
);

CREATE TABLE control_plan_subthemes (
    id serial PRIMARY KEY,
    subtheme text,
    allowed_tags text[],
    theme_id int REFERENCES control_plan_themes(id),
    year int
);
CREATE INDEX idx_control_plan_subthemes_year ON control_plan_subthemes USING btree(year);

CREATE TABLE env_actions_subthemes (
  env_action_id uuid,
  subtheme_id integer,
  tags text[],
  foreign key (env_action_id) references env_actions(id),
  foreign key (subtheme_id) references control_plan_subthemes(id),
  primary key (env_action_id, subtheme_id)
);
-- TODO: Décider s'il faut ajouter une contrainte sur les tags de env_actions_subthemes
-- Si oui, il faudra probablement passer par un trigger
-- (pas possible avec postgres de faire une contrainte "classique")


COMMENT ON TABLE control_plan_themes IS 'Table des thèmes du plan de contrôle';
COMMENT ON TABLE control_plan_subthemes IS 'Table des sous-thèmes du plan de contrôle versionnés par année';
COMMENT ON TABLE env_actions_subthemes IS 'Table de jointure entre les actions et les sous-thèmes du plan de contrôle';

-- Insertion des themes et sous-themes à partir de la table control_themes
INSERT INTO control_plan_themes (theme)
    SELECT distinct theme_level_1 FROM control_themes ORDER BY theme_level_1
    ;

INSERT INTO control_plan_subthemes (subtheme, theme_id, year)
    SELECT distinct theme_level_2, t.id, 2023
        FROM control_themes c JOIN control_plan_themes t ON t.theme = theme_level_1
        WHERE theme_level_2 IS NOT NULL ORDER BY theme_level_2
    ;

UPDATE control_plan_subthemes
    SET allowed_tags = '{"Oiseaux", "Habitat", "Flore", "Autres espèces protégées", "Reptiles", "Mammifères marins"}'
    FROM control_plan_themes t
    WHERE
        t.id = control_plan_subthemes.theme_id
        AND t.theme = 'Police des espèces protégées et de leurs habitats (faune et flore)';

-- Insertion des données depuis les env actions dans la table env_actions_subthemes
INSERT INTO env_actions_subthemes (env_action_id, subtheme_id, tags)
    WITH themes AS (
        SELECT
            id as env_action_id,
            jsonb_array_elements(value->'themes')->>'theme' as theme,
        jsonb_array_elements_text(jsonb_array_elements(value->'themes')->'subThemes') as subtheme,
        jsonb_array_elements(value->'themes')->'protectedSpecies' as protectedspecies
    FROM env_actions
        )
    SELECT themes.env_action_id,  sbt.id, CASE WHEN cardinality(d.tags) >0 THEN d.tags END
    FROM themes,
        LATERAL (
            SELECT ARRAY(
                       SELECT CASE species
                            WHEN 'BIRDS' THEN 'Oiseaux'
                            WHEN 'HABITAT' THEN 'Habitat'
                            WHEN 'FLORA' THEN 'Flore'
                            WHEN 'OTHER' THEN 'Autres espèces protégées'
                            WHEN 'REPTILES' THEN 'Reptiles'
                            WHEN 'MARINE_MAMMALS' THEN 'Mammifères marins'
                            ELSE 'Non défini'
                            END
                        FROM (SELECT jsonb_array_elements_text(protectedspecies) species) t
                        )
                ) d(tags),
         control_plan_subthemes sbt,
         control_plan_themes t
    WHERE sbt.subtheme = themes.subtheme
      AND  sbt.theme_id = t.id
      AND t.theme = themes.theme
      AND sbt.year = 2023;

