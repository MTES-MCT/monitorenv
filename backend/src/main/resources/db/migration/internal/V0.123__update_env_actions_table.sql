-- Update `closed_by` column by renaming it to `completed_by`
ALTER TABLE public.missions
    RENAME COLUMN closed_by to completed_by;

CREATE TYPE mission_action_completion AS ENUM ('TO_COMPLETE', 'COMPLETED');

ALTER TABLE public.env_actions ADD COLUMN completion mission_action_completion default 'TO_COMPLETE';
ALTER TABLE public.env_actions ADD COLUMN open_by text;
ALTER TABLE public.env_actions ADD COLUMN completed_by text;


-- Update `completion` column for past mission actions
UPDATE env_actions
SET completion = 'COMPLETED',
 open_by = missions.open_by,
 completed_by = missions.completed_by
FROM missions
WHERE
    missions.id = env_actions.mission_id AND
    action_type IN ('CONTROL', 'SURVEILLANCE') AND
    missions.closed;



