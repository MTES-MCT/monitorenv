UPDATE env_actions
SET value = jsonb_set(
  value,
  '{awareness}',
  jsonb_build_object(
    'details', jsonb_build_array(
      jsonb_build_object(
        'themeId', ((value -> 'awareness' ->> 'themeId')::int),
        'nbPerson', ((value -> 'awareness' ->> 'nbPerson')::int)
      )
    ),
    'isRisingAwareness', value -> 'awareness' -> 'isRisingAwareness'
  )
)
WHERE value ? 'awareness'
  AND action_type = 'SURVEILLANCE'
  AND mission_id > 0
  AND jsonb_typeof(value -> 'awareness') = 'object';