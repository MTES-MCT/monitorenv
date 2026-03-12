package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AMPModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBAMPRepository : JpaRepository<AMPModel, Int> {
    @Query(
        value =
            """
            SELECT id FROM AMPModel
            WHERE ST_INTERSECTS(st_setsrid(geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
        """,
    )
    fun findAllIdsByGeom(geometry: Geometry): List<Int>

    fun findAllByOrderByName(): List<AMPModel>

    @Query(
        value =
            """
            SELECT * FROM amp_cacem amp
            WHERE amp.id IN (:ids)
               ORDER BY
                CASE
                    WHEN :axis = 'NORTH_SOUTH' THEN ST_Y(ST_PointOnSurface(amp.geom))
                END DESC,
                CASE
                    WHEN :axis = 'SOUTH_NORTH' THEN ST_Y(ST_PointOnSurface(amp.geom))
                END ASC,
                CASE
                    WHEN :axis = 'WEST_EAST' THEN ST_X(ST_PointOnSurface(amp.geom))
                END ASC,
                CASE
                    WHEN :axis = 'EAST_WEST' THEN ST_X(ST_PointOnSurface(amp.geom))
                END DESC
        """,
        nativeQuery = true,
    )
    fun findAllByIds(
        ids: List<Int>,
        axis: String,
    ): List<AMPModel>
}
