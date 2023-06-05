SELECT 
    CASE WHEN facade = 'Corse' THEN 'MED' ELSE facade END AS facade,
    st_multi(ST_SubDivide(geometry)) AS geometry
FROM prod.facade_areas