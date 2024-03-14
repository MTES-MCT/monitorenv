UPDATE env_actions
SET geom = missions.geom
FROM missions
WHERE 
    missions.id = env_actions.mission_id AND
    env_actions.action_type = 'SURVEILLANCE' AND 
    env_actions.geom IS NULL AND
	misisons.geom IS NOT NULL;
