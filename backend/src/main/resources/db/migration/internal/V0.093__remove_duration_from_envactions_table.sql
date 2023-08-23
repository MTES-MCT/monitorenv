UPDATE public.env_actions
SET value = value - 'duration'
WHERE value ? 'duration'
