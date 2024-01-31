DROP VIEW analytics_controls_locations;

CREATE VIEW analytics_controls_locations AS
    SELECT
        a.id as action_id,
        a.action_start_datetime_utc,
        COALESCE(t3.theme, 'Aucun thème') AS theme,
        COALESCE(t2.subtheme, 'Aucun sous-thème') AS subtheme,
        m.facade AS facade,
        St_X((St_Dump(a.geom)).geom) AS lon,
        St_Y((St_Dump(a.geom)).geom) AS lat
    FROM missions m
    JOIN env_actions AS a ON m.id=a.mission_id
    LEFT JOIN env_actions_control_plan_themes t0 on t0.env_action_id = a.id
    LEFT JOIN env_actions_control_plan_sub_themes t1 on t1.env_action_id = a.id
    LEFT JOIN control_plan_sub_themes t2 on t2.id = t1.subtheme_id
    LEFT JOIN control_plan_themes t3 on t3.id = t0.theme_id    
    WHERE
        a.action_type='CONTROL'
