ALTER TABLE public.missions
    RENAME COLUMN closed_by to completed_by;

CREATE TYPE mission_action_completion AS ENUM ('TO_COMPLETE', 'COMPLETED');

ALTER TABLE public.env_actions ADD COLUMN action_completion mission_action_completion default 'TO_COMPLETE';
ALTER TABLE public.env_actions ADD COLUMN action_open_by text;
ALTER TABLE public.env_actions ADD COLUMN action_completed_by text;


-- Update `completion` column for past mission actions
UPDATE env_actions
SET action_completion = 'COMPLETED',
 action_open_by = missions.open_by,
 action_completed_by = missions.completed_by
FROM missions
WHERE
    missions.id = env_actions.mission_id AND
    action_type IN ('CONTROL', 'SURVEILLANCE') AND
    missions.closed;
