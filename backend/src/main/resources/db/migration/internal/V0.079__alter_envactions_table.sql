ALTER TABLE public.env_actions 
    ADD column action_end_datetime_utc TIMESTAMP;


UPDATE env_actions
SET action_start_datetime_utc = missions.start_datetime_utc
FROM missions
WHERE 
    missions.id = env_actions.mission_id AND
    env_actions.action_type = 'SURVEILLANCE' AND 
    missions.closed AND
    env_actions.action_start_datetime_utc IS NULL;


WITH missions_missing_end_datetimes AS (
    SELECT
        missions.id,
        MAX(
            COALESCE(
                CASE
                    WHEN action_type = 'SURVEILLANCE' THEN action_start_datetime_utc + make_interval(mins => ((value->>'duration')::DOUBLE PRECISION * 60)::INTEGER )
                    WHEN action_type = 'CONTROL' THEN action_start_datetime_utc
                END,
                start_datetime_utc
            )
        ) AS computed_end_datetime_utc
    FROM missions
    LEFT JOIN env_actions
    ON missions.id = env_actions.mission_id
    WHERE
        closed AND
        end_datetime_utc IS NULL
    GROUP BY missions.id
    )
    UPDATE missions
        SET end_datetime_utc = missions_missing_end_datetimes.computed_end_datetime_utc
        FROM missions_missing_end_datetimes
        WHERE missions.id = missions_missing_end_datetimes.id;


UPDATE env_actions
SET action_end_datetime_utc = CASE 
        WHEN COALESCE((value->>'duration')::DOUBLE PRECISION, 0) = 0 THEN missions.end_datetime_utc
        ELSE action_start_datetime_utc + make_interval(mins => ((value->>'duration')::DOUBLE PRECISION * 60)::INTEGER)
END
FROM missions
WHERE missions.id = env_actions.mission_id AND env_actions.action_type = 'SURVEILLANCE';


UPDATE public.env_actions
    SET value = value - 'duration';
