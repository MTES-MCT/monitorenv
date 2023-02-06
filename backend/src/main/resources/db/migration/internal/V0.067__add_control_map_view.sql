CREATE VIEW analytics_controls_locations AS
    SELECT
        e.id as action_id,
        e.action_start_datetime_utc,
        e.value ->>'actionTheme' AS theme,
        e.value ->>'actionSubTheme' AS subtheme,
        missions.facade AS facade,
        St_X((St_Dump(e.geom)).geom) AS lon,
        St_Y((St_Dump(e.geom)).geom) AS lat
    FROM missions
    JOIN env_actions AS e ON missions.id=e.mission_id
    WHERE
        e.action_type='CONTROL'
