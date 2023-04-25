UPDATE public.env_actions SET
value = jsonb_set(
    value,
    '{themes}',
    jsonb_build_array()
)
- 'actionTheme'
- 'actionSubTheme'
WHERE value->>'actionTheme' = '';