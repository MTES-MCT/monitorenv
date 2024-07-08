DROP VIEW public.reporting_actions;

CREATE VIEW public.reporting_actions AS

SELECT
    r.id,
    TEXT(reporting_id) AS reporting_id,
    TO_TIMESTAMP(cast(created_at as TEXT),'YYYY-MM-DD-HH24:MI') AS signal_datetime_utc,
    TEXT(source_type) AS source_type,
    CASE
        WHEN source_type = 'SEMAPHORE' THEN semaphores.nom
        WHEN source_type = 'CONTROL_UNIT' THEN control_units.name
        ELSE TEXT(source_name)
    END AS origin_signal,
    TEXT(sea_front) AS signal_facade,
    CASE
        WHEN r.theme IS NOT NULL THEN TEXT(r.theme)
        ELSE control_plan_themes.theme
    END AS theme_level_1,
    TEXT(report_type) AS report_type,
    CASE
        WHEN vehicle_type IS NULL THEN TEXT(target_type)
        ELSE TEXT(vehicle_type)
    END AS target_type,
    REPLACE(details->>'mmsi',' ','') AS mmsi,
    details->>'vesselName' AS nom_navireSociete,
    details->>'size' AS size,
    details->>'imo' AS imo,
    details->>'externalReferenceNumber' AS immatriculation,
    details->>'operatorName' AS nom_propre,
    CASE
        WHEN with_vhf_answer = 'false' THEN TEXT('NON')
        WHEN with_vhf_answer = 'true' THEN TEXT('OUI')
        ELSE NULL
    END AS reponse_vhf,
    is_infraction_proven,
    CASE
        WHEN is_control_required = 'false' THEN TEXT('NON')
        WHEN is_control_required = 'true' THEN TEXT('OUI')
        ELSE NULL
    END AS control_required,
    CASE
        WHEN has_no_unit_available = 'false' THEN TEXT('DISPONIBLE')
        WHEN has_no_unit_available = 'true' THEN TEXT('NON DISPONIBLE')
        WHEN has_no_unit_available IS NULL AND r.mission_id IS NOT NULL THEN TEXT('DISPONIBLE')
        ELSE NULL
    END AS control_unit_dispo,
    CASE
        WHEN detached_from_mission_at_utc IS NULL THEN r.mission_id
        ELSE NULL
    END AS mission_id,
    r.attached_env_action_id AS action_id,
    r.geom,
    TEXT(description) AS description,
    TEXT(action_taken) AS action_taken,
    TEXT(open_by) AS open_by
FROM reportings r
LEFT JOIN semaphores ON r.semaphore_id = semaphores.id
LEFT JOIN control_units ON r.control_unit_id = control_units.id
LEFT JOIN control_plan_themes ON r.control_plan_theme_id = control_plan_themes.id
    LEFT JOIN LATERAL jsonb_array_elements(target_details) AS details ON TRUE
WHERE is_deleted = 'false'
ORDER BY id DESC
