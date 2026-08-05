SELECT
    ra.id,
    st_multi(ST_SimplifyPreserveTopology(ST_CurveToLine(ra.geom), 0.00001)) geom,
    ra.url,
    ra.layer_name,
    ra.facade,
    ra.creation,
    ra.edition_bo,
    ra.edition_cacem,
    ra.date,
    ra.date_fin,
    ra.type,
    ra.resume,
    ra.poly_name,
    ra.plan,
    ra.authorization_periods,
    ra.prohibition_periods,
    ra.location,
    ra.area_type,
    ra.additional_ref_reg
FROM regulatory_areas ra
WHERE area_type = 'GROUP';