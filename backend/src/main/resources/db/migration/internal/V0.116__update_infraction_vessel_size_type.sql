
UPDATE env_actions t
SET value = 
jsonb_set(value, '{infractions}', 
		  (SELECT jsonb_agg(
		CASE
			WHEN j1->'vesselSize' = '"LESS_THAN_12m"'
			THEN jsonb_set(j1, '{vesselSize}','"11"')
			WHEN j1->'vesselSize' = '"FROM_12_TO_24m"'
			THEN jsonb_set(j1, '{vesselSize}','"23"')
			WHEN j1->'vesselSize' = '"FROM_24_TO_46m"'
			THEN jsonb_set(j1, '{vesselSize}','"45"')
			WHEN j1->'vesselSize' = '"MORE_THAN_46m"'
			THEN jsonb_set(j1, '{vesselSize}','"46"')
			ELSE j1
		END
        )
     FROM env_actions, jsonb_array_elements(t.value->'infractions') j1
     )
)
    
WHERE
	action_type = 'CONTROL'
	AND jsonb_array_length(t.value->'infractions') > 0
	AND mission_id > 0
;
