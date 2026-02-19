package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaNewModel
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
            AND regulatoryArea.creation IS NOT NULL
            ORDER BY regulatoryArea.layerName
        """,
    )
    fun findAll(
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
}
