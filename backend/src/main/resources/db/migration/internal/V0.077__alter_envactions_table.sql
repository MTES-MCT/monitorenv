ALTER TABLE public.env_actions 
    ADD column action_end_datetime_utc TIMESTAMP;

UPDATE env_actions
SET action_end_datetime_utc = CASE 
        WHEN COALESCE((value->>'duration')::DOUBLE PRECISION, 0) = 0 THEN missions.end_datetime_utc
        ELSE action_start_datetime_utc + make_interval(mins => ((value->>'duration')::DOUBLE PRECISION * 60)::INTEGER)
END
FROM missions
WHERE missions.id = env_actions.mission_id AND env_actions.action_type = 'SURVEILLANCE';

UPDATE public.env_actions
    SET value = value - 'duration';
