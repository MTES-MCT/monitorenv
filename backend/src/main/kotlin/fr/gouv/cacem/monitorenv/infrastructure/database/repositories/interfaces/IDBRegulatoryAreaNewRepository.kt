package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaNewModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaNewRepository : JpaRepository<RegulatoryAreaNewModel, Int> {
    @Query(
        value =
            """
            SELECT regulatoryArea
            FROM RegulatoryAreaNewModel regulatoryArea
            WHERE (:seaFronts IS NULL OR regulatoryArea.facade IN (:seaFronts))
            AND regulatoryArea.creation IS NOT NULL
            ORDER BY regulatoryArea.layerName
        """,
    )
    fun findAll(seaFronts: List<String>? = emptyList()): List<RegulatoryAreaNewModel>

    fun findAllByCreationIsNull(): List<RegulatoryAreaNewModel>

    @Query(
        value =
            """
            SELECT DISTINCT regulatoryArea.layerName
            FROM RegulatoryAreaNewModel regulatoryArea
            ORDER BY regulatoryArea.layerName
        """,
    )
    fun findAllLayerNames(): List<String>
}
