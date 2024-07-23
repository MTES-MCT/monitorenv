BEGIN;

-- Décomposer le tableau en éléments individuels
WITH decomposed AS (SELECT id,
                           jsonb_array_elements(value -> 'infractions') AS infractions,
                           value - 'infractions'                        AS value_without_infractions
                    FROM env_actions),

-- Ajouter la nouvelle clé à chaque élément
     updated AS (SELECT id,
                        infractions || jsonb_build_object('nbTarget', 1) AS updated_infractions,
                        value_without_infractions
                 FROM decomposed),

-- Recomposer les objets modifiés en un tableau
     recomposed AS (SELECT id,
                           jsonb_agg(updated_infractions) AS new_infractions,
                           value_without_infractions
                    FROM updated
                    GROUP BY id, value_without_infractions)

-- Mettre à jour la table avec les nouveaux objets
UPDATE env_actions
SET value = value_without_infractions || jsonb_build_object('infractions', new_infractions)
FROM recomposed
WHERE env_actions.id = recomposed.id;

COMMIT;
