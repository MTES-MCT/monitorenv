package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaGroupModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaGroupPk
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.projections.RegulatoryAreaGroupWithTotal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaGroupRepository : JpaRepository<RegulatoryAreaGroupModel, RegulatoryAreaGroupPk> {
    fun deleteAllByGroupId(groupId: Int)

    fun deleteAllByRegulatoryAreaId(regulatoryAreaId: Int)

    @Query(
        value =
            """
            SELECT regulatoryAreaGroup FROM RegulatoryAreaGroupModel regulatoryAreaGroup
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
            SELECT regulatoryAreaGroup FROM RegulatoryAreaGroupModel regulatoryAreaGroup
            LEFT JOIN regulatoryAreaGroup.regulatoryArea regulatoryArea
            WHERE regulatoryArea.id IN (:ids)
            AND regulatoryArea.creation IS NOT NULL
            ORDER BY
                CASE WHEN :axis = 'NORTH_SOUTH' THEN ST_Y(ST_PointOnSurface(regulatoryArea.geom)) END DESC,
                CASE WHEN :axis = 'SOUTH_NORTH' THEN ST_Y(ST_PointOnSurface(regulatoryArea.geom)) END ASC,
                CASE WHEN :axis = 'WEST_EAST'   THEN ST_X(ST_PointOnSurface(regulatoryArea.geom)) END ASC,
                CASE WHEN :axis = 'EAST_WEST'   THEN ST_X(ST_PointOnSurface(regulatoryArea.geom)) END DESC,
            ST_Y(ST_PointOnSurface(regulatoryArea.geom)) DESC
        """,
    )
    fun findAllCompleteByIds(
        ids: List<Int>,
        axis: String,
    ): List<RegulatoryAreaGroupModel>

    @Query(
        value =
            """
            SELECT regulatoryAreaGroup FROM RegulatoryAreaGroupModel regulatoryAreaGroup
            WHERE regulatoryAreaGroup.group.id IN (:id)
            AND regulatoryAreaGroup.regulatoryArea.creation IS NOT NULL
        """,
    )
    fun findAllByGroupId(id: Int): List<RegulatoryAreaGroupModel>

    @Query(
        value =
            """
            SELECT regulatoryAreaGroup FROM RegulatoryAreaGroupModel regulatoryAreaGroup
            WHERE regulatoryAreaGroup.regulatoryArea.id = :id
            AND regulatoryAreaGroup.regulatoryArea.creation IS NOT NULL
        """,
    )
    fun findAllByRegulatoryAreaId(id: Int): List<RegulatoryAreaGroupModel>

    @Query(
        value =
            """
            SELECT regulatoryAreaGroup FROM RegulatoryAreaGroupModel regulatoryAreaGroup
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
        SELECT new fr.gouv.cacem.monitorenv.infrastructure.database.repositories.projections.RegulatoryAreaGroupWithTotal(
            ra,
            COUNT(rag.id.regulatoryAreaId)
        )
        FROM RegulatoryAreaModel ra
        LEFT JOIN RegulatoryAreaGroupModel rag ON rag.id.groupId = ra.id
        WHERE ra.areaType = 'GROUP'
        and ra.layerName IS NOT NULL
        GROUP BY ra
        ORDER BY ra.layerName
    """,
    )
    fun findAllLayerNames(): List<RegulatoryAreaGroupWithTotal>
}
