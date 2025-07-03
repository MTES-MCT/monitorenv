BEGIN;

-- Décomposer le tableau en éléments individuels
WITH decomposed AS (SELECT id,
                           jsonb_array_elements(value -> 'infractions') AS obj,
                           value - 'infractions'                        AS data_without_items
                    FROM env_actions),

-- Ajouter la nouvelle clé à chaque élément
     updated AS (SELECT id,
                        obj || jsonb_build_object('nbTarget', 1) AS updated_obj,
                        data_without_items
                 FROM decomposed),

-- Recomposer les objets modifiés en un tableau
     recomposed AS (SELECT id,
                           jsonb_agg(updated_obj) AS new_items,
                           data_without_items
                    FROM updated
                    GROUP BY id, data_without_items)

-- Mettre à jour la table avec les nouveaux objets
UPDATE env_actions
SET value = data_without_items || jsonb_build_object('infractions', new_items)
FROM recomposed
WHERE env_actions.id = recomposed.id;

COMMIT;
