package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaNewModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaNewRepository : JpaRepository<RegulatoryAreaNewModel, Int> {
    @Query(
        value =
            """
            SELECT DISTINCT regulatoryArea
            FROM RegulatoryAreaNewModel regulatoryArea
            LEFT JOIN regulatoryArea.themes th
            LEFT JOIN regulatoryArea.tags tg
            WHERE (:seaFronts IS NULL OR regulatoryArea.facade IN (:seaFronts))
            AND (:themes IS NULL OR th.theme.id IN :themes)
            AND (:tags IS NULL OR tg.tag.id IN :tags)
            AND (:controlPlan IS NULL OR regulatoryArea.plan LIKE %:controlPlan%)
            AND regulatoryArea.creation IS NOT NULL
            ORDER BY regulatoryArea.layerName
        """,
    )
    fun findAll(
        controlPlan: String? = null,
        seaFronts: List<String>? = null,
        tags: List<Int>? = null,
        themes: List<Int>? = null,
    ): List<RegulatoryAreaNewModel>

    fun findAllByCreationIsNull(): List<RegulatoryAreaNewModel>

    @Query(
        """
        SELECT regulatoryArea.layerName, COUNT(regulatoryArea)
        FROM RegulatoryAreaNewModel regulatoryArea
        WHERE regulatoryArea.layerName IS NOT NULL
        GROUP BY regulatoryArea.layerName
        ORDER BY regulatoryArea.layerName
    """,
    )
    fun findAllLayerNames(): List<Array<Any>>

    @Query(
        value =
            """
            SELECT r.id FROM RegulatoryAreaNewModel r
            WHERE ST_INTERSECTS(st_setsrid(r.geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
        """,
    )
    fun findAllIdsByGeom(geometry: Geometry): List<Int>

    @Query(
        value =
            """
            SELECT regulatoryArea
            FROM RegulatoryAreaNewModel regulatoryArea
            WHERE regulatoryArea.id IN :ids
            AND regulatoryArea.creation IS NOT NULL
        """,
    )
    fun findAllCompleteByIds(ids: List<Int>): List<RegulatoryAreaNewModel>
}
