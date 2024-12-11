package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.FacadeAreasModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface IDBFacadeAreasRepository : CrudRepository<FacadeAreasModel, Int> {
    @Query(
        """
        WITH geom AS (
            SELECT st_setsrid(ST_Union(:geometry), 4326) AS geom
        ),

        facades_intersection_areas AS (
            SELECT
                facade,
                SUM(
                    ST_Area(
                        CAST(
                            ST_Intersection(
                                geom.geom,
                                facade_areas_subdivided.geometry
                            ) AS geography
                        )
                    )
                ) AS intersection_area
            FROM facade_areas_subdivided
            JOIN geom
            ON ST_Intersects(geom.geom, facade_areas_subdivided.geometry)
            GROUP BY facade
        )

        SELECT facade
        FROM facades_intersection_areas
        ORDER BY intersection_area DESC
        LIMIT 1
     """,
        nativeQuery = true,
    )
    fun findFacadeFromGeometry(geometry: Geometry): String?
}
