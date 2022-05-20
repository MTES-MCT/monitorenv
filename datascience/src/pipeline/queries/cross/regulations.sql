SELECT
    id,
    law_type,
    facade,
    topic,
    zone,
    region,
    fishing_period,
    gears,
    species,
    regulatory_references,
    ST_CurveToLine(geometry) AS geometry,
    geometry_simplified
FROM prod.regulations