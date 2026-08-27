package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaGroupModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaGroupPk
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaGroupRepository : JpaRepository<RegulatoryAreaGroupModel, RegulatoryAreaGroupPk> {
    fun deleteAllByGroupId(groupId: Int)

    fun deleteAllByRegulatoryAreaId(regulatoryAreaId: Int)

    @Query(
        value =
            """
            SELECT regulatoryAreaGroup from RegulatoryAreaGroupModel regulatoryAreaGroup
            LEFT JOIN regulatoryAreaGroup.regulatoryArea regulatoryArea
            LEFT JOIN regulatoryArea.themes th
            LEFT JOIN regulatoryArea.tags tg
            WHERE (:seaFronts IS NULL OR regulatoryArea.facade IN (:seaFronts))
            AND (:themes IS NULL OR th.theme.id IN :themes)
            AND (:tags IS NULL OR tg.tag.id IN :tags)
            AND (:controlPlan IS NULL OR regulatoryArea.plan LIKE %:controlPlan%)
            AND regulatoryArea.creation IS NOT NULL
            AND (:onlyRecentsAreas IS FALSE OR (
                regulatoryArea.creation >= DATEADD(DAY, -30, CURRENT_TIMESTAMP)
                OR regulatoryArea.editionBo >= DATEADD(DAY, -30, CURRENT_TIMESTAMP)
                OR regulatoryArea.editionCacem >= DATEADD(DAY, -30, CURRENT_TIMESTAMP)
            ))
            ORDER BY regulatoryArea.layerName
        """,
    )
    fun findAll(
        controlPlan: String? = null,
        seaFronts: List<String>? = null,
        tags: List<Int>? = null,
        themes: List<Int>? = null,
        onlyRecentsAreas: Boolean? = false,
    ): List<RegulatoryAreaGroupModel>

    @Query(
        value =
            """
            SELECT regulatoryAreaGroup from RegulatoryAreaGroupModel regulatoryAreaGroup
            WHERE regulatoryAreaGroup.group.id = :id
            AND regulatoryAreaGroup.regulatoryArea.creation IS NOT NULL
        """,
    )
    fun findAllByGroupId(id: Int): List<RegulatoryAreaGroupModel>

    @Query(
        value =
            """
            SELECT regulatoryAreaGroup from RegulatoryAreaGroupModel regulatoryAreaGroup
            WHERE regulatoryAreaGroup.group.layerName = :layerName
                AND regulatoryAreaGroup.group.location = :location
                AND regulatoryAreaGroup.group.creation IS NOT NULL
        """,
    )
    fun findAllByLayerNameAndLocation(
        layerName: String,
        location: String,
    ): List<RegulatoryAreaGroupModel>

    @Query(
        """
        SELECT regulatoryAreaGroup
        FROM RegulatoryAreaGroupModel regulatoryAreaGroup
        WHERE regulatoryAreaGroup.group.layerName IS NOT NULL
        ORDER BY regulatoryAreaGroup.group.layerName
    """,
    )
    fun findAllLayerNames(): List<RegulatoryAreaGroupModel>
}
