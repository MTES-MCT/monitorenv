package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface IDBVigilanceAreaRepository : JpaRepository<VigilanceAreaModel, Int> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        value =
            """
        UPDATE vigilance_areas
        SET is_deleted = TRUE
        WHERE id = :id
    """,
        nativeQuery = true,
    )
    fun delete(id: Int)

    fun findAllByIsDeletedIsFalse(): List<VigilanceAreaModel>

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        value =
            """
        UPDATE vigilance_areas
        SET is_archived = TRUE
        WHERE computed_end_date IS NOT NULL
            AND computed_end_date < NOW()
            AND is_archived IS FALSE
            AND is_at_all_times IS FALSE
    """,
        nativeQuery = true,
    )
    fun archiveOutdatedVigilanceAreas(): Int

    @Query(
        value =
            """
            SELECT vigilanceArea.id FROM VigilanceAreaModel vigilanceArea
            WHERE ST_INTERSECTS(st_setsrid(vigilanceArea.geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
        """,
    )
    fun findAllIdsByGeom(geometry: Geometry): List<Int>

    @Query(
        value =
            """
            SELECT DISTINCT vigilanceArea.createdBy FROM VigilanceAreaModel vigilanceArea
            WHERE vigilanceArea.createdBy IS NOT NULL
            ORDER BY vigilanceArea.createdBy
        """,
    )
    fun findAllTrigrams(): List<String>
}
