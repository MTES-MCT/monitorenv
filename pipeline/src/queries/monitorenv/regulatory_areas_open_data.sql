WITH theme_agg AS (
    SELECT
        tra.regulatory_areas_id AS ra_id,
        COALESCE(parent.name, t.name) AS parent_name,
        CASE
            WHEN t.parent_id IS NOT NULL THEN t.name
        END AS child_name
    FROM themes_regulatory_areas tra
    JOIN themes t ON t.id = tra.themes_id
    LEFT JOIN themes parent ON parent.id = t.parent_id
),
theme_grouped AS (
    SELECT
        ra_id,
        parent_name,
        COALESCE(
            jsonb_agg(DISTINCT child_name) FILTER (WHERE child_name IS NOT NULL),
            '[]'::jsonb
        ) AS children
    FROM theme_agg
    GROUP BY ra_id, parent_name
),
theme_final AS (
    SELECT
        ra_id,
        jsonb_object_agg(parent_name, children) AS themes_json
    FROM theme_grouped
    GROUP BY ra_id
),
tag_agg AS (
    SELECT
        trt.regulatory_areas_id AS ra_id,
        COALESCE(parent.name, tag.name) AS parent_name,
        CASE
            WHEN tag.parent_id IS NOT NULL THEN tag.name
        END AS child_name
    FROM tags_regulatory_areas trt
    JOIN tags tag ON tag.id = trt.tags_id
    LEFT JOIN tags parent ON parent.id = tag.parent_id
),
tag_grouped AS (
    SELECT
        ra_id,
        parent_name,
        COALESCE(
            jsonb_agg(DISTINCT child_name) FILTER (WHERE child_name IS NOT NULL),
            '[]'::jsonb
        ) AS children
    FROM tag_agg
    GROUP BY ra_id, parent_name
),
tag_final AS (
    SELECT
        ra_id,
        jsonb_object_agg(parent_name, children) AS tags_json
    FROM tag_grouped
    GROUP BY ra_id
)
SELECT
    ra.id,
    ra.creation::timestamp,
    ra.url,
    ra.layer_name,
    ra.facade,
    ra.ref_reg,
    GREATEST(ra.edition_bo::timestamp, ra.edition_cacem::timestamp) AS edition,
    ra.editeur,
    ra.source,
    ra.observation,
    ra.date::timestamp,
    ra.date_fin::timestamp,
    ra.type,
    ST_ASTEXT(ST_CurveToLine(ra.geom)) AS wkt,
    ra.resume,
    ra.poly_name,
    ra.plan,
    ra.geom AS geometry,
    ra.authorization_periods,
    ra.prohibition_periods,
    ra.additional_ref_reg,
    ra.location,
    COALESCE(theme_final.themes_json, '{}'::jsonb) AS themes,
    COALESCE(tag_final.tags_json, '{}'::jsonb) AS tags
FROM public.regulatory_areas ra
LEFT JOIN theme_final ON theme_final.ra_id = ra.id
LEFT JOIN tag_final ON tag_final.ra_id = ra.id
WHERE ra.layer_name IS NOT NULL
  AND ra.area_type = 'ZONE';


