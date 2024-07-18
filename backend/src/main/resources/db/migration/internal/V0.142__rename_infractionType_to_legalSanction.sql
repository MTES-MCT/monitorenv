BEGIN;

-- Étape 1: Vérifier que "items" contient un tableau et extraire les objets du tableau
WITH decomposed AS (SELECT id,
                           jsonb_array_elements(value -> 'infractions') AS obj,
                           value - 'infractions'                        AS data_without_items
                    FROM env_actions
                    WHERE jsonb_typeof(value -> 'infractions') = 'array'),

-- Étape 2: Modifier chaque objet JSON en remplaçant la clé
     updated AS (SELECT id,
                        obj ||
                        jsonb_build_object('legalSanction', obj -> 'infractionType') - 'infractionType' AS updated_obj,
                        data_without_items
                 FROM decomposed),

-- Étape 3: Recomposer les objets modifiés en un nouveau tableau
     recomposed AS (SELECT id,
                           jsonb_agg(updated_obj) AS new_items,
                           data_without_items
                    FROM updated
                    GROUP BY id, data_without_items),

-- Étape 4: Inclure les lignes avec des tableaux vides
     original_with_empty AS (SELECT id,
                                    value
                             FROM env_actions
                             WHERE jsonb_typeof(value -> 'infractions') = 'array'
                               AND jsonb_array_length(value -> 'infractions') = 0),

-- Étape 5: Mettre à jour la table avec les nouveaux objets
     final_update AS (SELECT recomposed.id,
                             data_without_items || jsonb_build_object('infractions', new_items) AS new_data
                      FROM recomposed
                      UNION ALL
                      SELECT original_with_empty.id,
                             original_with_empty.value
                      FROM original_with_empty)
UPDATE env_actions
SET value = final_update.new_data
FROM final_update
WHERE env_actions.id = final_update.id;

COMMIT;
