UPDATE env_actions t
SET value = 
jsonb_set(value, '{infractions}', 
    (
    SELECT jsonb_agg(
        jsonb_set(infraction, '{seizure}', '"NONE"')
    )
    FROM jsonb_array_elements(t.value->'infractions') infraction
    )
)
WHERE
	action_type = 'CONTROL'
	AND jsonb_array_length(t.value->'infractions') > 0
	AND mission_id > 0;



