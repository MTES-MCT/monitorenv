package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.DepartmentAreaModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface IDBDepartmentAreaRepository : CrudRepository<DepartmentAreaModel, Int> {
    @Query(
        value =
        """
        SELECT *
        FROM departments_areas
        WHERE insee_dep = :inseeCode
        """,
        nativeQuery = true,
    )
    fun findByInseeCode(inseeCode: String): DepartmentAreaModel

    @Query(
        """
        WITH geom AS (
            SELECT CASE
                WHEN GeometryType(ST_SetSRID(:geometry, 4326)) IN ('ST_MultiPolygon', 'ST_Polygon')
                THEN ST_Buffer(ST_SetSRID(:geometry, 4326), 0)
                ELSE ST_SetSRID(:geometry, 4326)
            END AS geom
        ),

        departments_intersection_areas AS (
            SELECT
                insee_dep,
                SUM(
                    ST_Area(
                        CAST(
                            ST_Intersection(
                                geom.geom,
                                departments_areas.geometry
                            ) AS geography
                        )
                    )
                ) AS intersection_area
            FROM departments_areas
            JOIN geom
            ON ST_Intersects(geom.geom, departments_areas.geometry)
            GROUP BY insee_dep
        )

        SELECT insee_dep
        FROM departments_intersection_areas
        ORDER BY intersection_area DESC
        LIMIT 1
     """,
        nativeQuery = true,
    )
    fun findDepartmentFromGeometry(geometry: Geometry): String?
}
