-- Regulatory areas and AMPs of Monitorenv that reference an url. Only urls
-- pointing to Legicem are used by the `Monitorenv - Legicem checkup` flow, the
-- filtering is done in python.
SELECT
    CASE
        WHEN area_type = 'GROUP' THEN 'Groupe de réglementations'
        ELSE 'Zone réglementaire'
    END AS reference_type,
    id,
    layer_name AS group_name,
    poly_name AS name,
    ref_reg AS reference,
    url
FROM regulatory_areas
WHERE url IS NOT NULL

UNION ALL

SELECT
    'AMP' AS reference_type,
    id,
    des_desigfr AS group_name,
    mpa_oriname AS name,
    ref_reg AS reference,
    url_legicem AS url
FROM amp_cacem
WHERE url_legicem IS NOT NULL

ORDER BY reference_type, group_name, name, id
