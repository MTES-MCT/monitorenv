CREATE TYPE mission_action_completion AS ENUM ('TO_COMPLETE', 'COMPLETED');

ALTER TABLE public.env_actions
    ADD COLUMN action_completion mission_action_completion default 'TO_COMPLETE';

-- Update `completion` column for past mission actions
UPDATE env_actions
SET action_completion = 'COMPLETED'
FROM missions
WHERE
    missions.id = env_actions.mission_id AND
    action_type IN ('CONTROL', 'SURVEILLANCE') AND
    missions.closed;
