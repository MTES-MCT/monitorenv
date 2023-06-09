SELECT
    dep.insee_dep,
    dep.nom AS name,
    ST_Multi(
        ST_MakeValid(
            ST_Simplify(
                CASE
                    WHEN dep_mer.geom IS NULL THEN dep.geom
                    ELSE ST_Union(dep.geom, dep_mer.geom)
                END,
                0.0001
            )
        )
    ) AS geometry
FROM prod.departements dep
LEFT JOIN prod.departements_en_mer_metropole dep_mer
ON dep.id = dep_mer.id

UNION ALL

SELECT
	CASE
		WHEN facade_cacem = 'Guadeloupe' THEN '971'
		WHEN facade_cacem = 'Mayotte' THEN '976D'
		WHEN facade_cacem = 'Martinique' THEN '972R'
		WHEN facade_cacem = 'Guyane' THEN '973R'
		WHEN facade_cacem = 'Sud Océan Indien' THEN '974'
	END AS insee_dep,
	CASE
		WHEN facade_cacem = 'Sud Océan Indien' THEN 'Réunion'
		ELSE facade_cacem
	END AS name,
	geometry
FROM prod.facade_areas
WHERE facade_cacem IN ('Guadeloupe', 'Mayotte', 'Martinique', 'Guyane', 'Sud Océan Indien')

ORDER BY insee_dep