CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DO
$$
    DECLARE
        row         RECORD;
        infractions jsonb;
        item        jsonb;
        new_uuid    uuid;
    BEGIN
        FOR row IN SELECT id, value FROM env_actions
            LOOP
                -- Vérifier si le champ "infractions" existe et n'est pas null
                IF row.value ? 'infractions' AND jsonb_typeof(row.value -> 'infractions') = 'array' THEN
                    infractions := row.value -> 'infractions';

                    FOR i IN 0 .. jsonb_array_length(infractions) - 1
                        LOOP
                            item := infractions -> i;

                            new_uuid := uuid_generate_v4();
                            item := jsonb_set(item, '{id}', to_jsonb(new_uuid)::jsonb, true);

                            -- Modifier l'id dans les infractions
                            infractions := jsonb_set(infractions, ('{' || i || '}')::text[], item, true);
                        END LOOP;

                    UPDATE env_actions
                    SET value = jsonb_set(row.value, '{infractions}', infractions, true)
                    WHERE id = row.id;
                END IF;
            END LOOP;
    END
$$;
