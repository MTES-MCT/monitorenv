SELECT 
    facade,
    st_multi(ST_SubDivide(geometry)) AS geometry
FROM prod.facade_areas