package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import org.hibernate.annotations.DynamicUpdate
import org.locationtech.jts.geom.Geometry
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.time.Instant
import java.util.UUID

@DynamicUpdate
interface IDBMissionRepository : JpaRepository<MissionModel, Int> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        value = """
        UPDATE missions
        SET deleted = TRUE
        WHERE id = :id
    """,
        nativeQuery = true,
    )
    fun delete(id: Int)

    @Query(
        """
        SELECT DISTINCT mission
        FROM MissionModel mission
        LEFT JOIN FETCH mission.envActions envactions
            LEFT JOIN FETCH envactions.themes themeEnvActions
                LEFT JOIN FETCH themeEnvActions.theme themes
                    LEFT JOIN themes.parent
            LEFT JOIN FETCH envactions.tags tagEnvActions
                LEFT JOIN FETCH tagEnvActions.tag tags
                    LEFT JOIN tags.parent
            LEFT JOIN FETCH envactions.attachedReporting envActionAttachedReporting
            LEFT JOIN FETCH envActionAttachedReporting.themes envActionAttachedReportingThemes
                LEFT JOIN FETCH envActionAttachedReportingThemes.theme envActionAttachedReportingThemesTheme
                    LEFT JOIN envActionAttachedReportingThemesTheme.parent
            LEFT JOIN FETCH envActionAttachedReporting.tags envActionAttachedReportingTags
                LEFT JOIN FETCH envActionAttachedReportingTags.tag envActionAttachedReportingTagsTag
                    LEFT JOIN envActionAttachedReportingTagsTag.parent
        LEFT JOIN FETCH mission.controlUnits missionControlUnits
            LEFT JOIN FETCH missionControlUnits.unit unit
                LEFT JOIN FETCH unit.administration unitAdministration
                LEFT JOIN FETCH unit.controlUnitResources unitResources
                    LEFT JOIN FETCH unitResources.station
        LEFT JOIN FETCH mission.attachedReportings attachedReportings
            LEFT JOIN FETCH attachedReportings.themes attachedReportingThemes
                LEFT JOIN FETCH attachedReportingThemes.theme attachedReportingThemesTheme
                LEFT JOIN attachedReportingThemesTheme.parent
            LEFT JOIN FETCH attachedReportings.tags attachedReportingTags
                LEFT JOIN FETCH attachedReportingTags.tag attachedReportingTagsTag
                    LEFT JOIN attachedReportingTagsTag.parent
            LEFT JOIN FETCH attachedReportings.reportingSources attachedReportingSources
                LEFT JOIN FETCH attachedReportingSources.semaphore
                LEFT JOIN FETCH attachedReportingSources.controlUnit
            LEFT JOIN FETCH attachedReportings.attachedEnvAction attachedEnvActions
                LEFT JOIN FETCH attachedEnvActions.themes attachedEnvActionsThemes
                    LEFT JOIN FETCH attachedEnvActionsThemes.theme attachedEnvActionsThemesTheme
                        LEFT JOIN attachedEnvActionsThemesTheme.parent
                LEFT JOIN FETCH attachedEnvActions.tags attachedEnvActionsTags
                    LEFT JOIN FETCH attachedEnvActionsTags.tag attachedEnvActionsTagsTag
                        LEFT JOIN attachedEnvActionsTagsTag.parent
        WHERE
            mission.isDeleted = false
            AND
            (:controlUnitIds IS NULL OR EXISTS (SELECT c FROM mission.controlUnits c WHERE c.unit.id IN :controlUnitIds))
            AND
            ((:missionTypeAIR = FALSE AND :missionTypeLAND = FALSE AND :missionTypeSEA = FALSE)
                OR (
                (:missionTypeAIR = TRUE AND (CAST(mission.missionTypes as String) like '%AIR%'))
                OR
                (:missionTypeLAND = TRUE AND (CAST(mission.missionTypes as String) like '%LAND%'))
                OR
                (:missionTypeSEA = TRUE AND (CAST(mission.missionTypes as String) like '%SEA%'))
            ))
            AND
             (
                (mission.startDateTimeUtc >= CAST(CAST(:startedAfter AS text) AS timestamp)
                    AND (
                        CAST(CAST(:startedBefore AS text) AS timestamp) IS NULL
                        OR mission.startDateTimeUtc <= CAST(CAST(:startedBefore AS text) AS timestamp)
                    )
                )
                OR (
                    mission.endDateTimeUtc >= CAST(CAST(:startedAfter AS text) AS timestamp)
                    AND (
                        CAST(CAST(:startedBefore AS text) AS timestamp) IS NULL
                        OR mission.endDateTimeUtc <= CAST(CAST(:startedBefore AS text) AS timestamp)
                    )
                )
            )
            AND (:seaFronts IS NULL OR mission.facade IN :seaFronts)
            AND (
                :missionStatuses IS NULL
                OR (
                    'UPCOMING' IN :missionStatuses AND (
                    mission.startDateTimeUtc >= CAST(now() AS timestamp)
                    ))
                OR (
                    'PENDING' IN :missionStatuses AND (
                    (mission.endDateTimeUtc IS NULL OR mission.endDateTimeUtc >= CAST(now() AS timestamp))
                    AND (mission.startDateTimeUtc <= CAST(now() AS timestamp))
                    )
                )
                OR (
                    'ENDED' IN :missionStatuses AND (
                    mission.endDateTimeUtc < CAST(now() AS timestamp)
                    )
                )
            )
            AND (:missionSources IS NULL
                OR mission.missionSource IN (:missionSources)
            )
        ORDER BY mission.startDateTimeUtc DESC
        """,
    )
    fun findAll(
        controlUnitIds: List<Int>? = emptyList(),
        missionStatuses: List<String>? = emptyList(),
        missionSources: List<MissionSourceEnum>? = emptyList(),
        missionTypeAIR: Boolean,
        missionTypeLAND: Boolean,
        missionTypeSEA: Boolean,
        pageable: Pageable,
        seaFronts: List<String>? = emptyList(),
        startedAfter: Instant,
        startedBefore: Instant?,
    ): List<MissionModel>

    @EntityGraph(value = "MissionModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)
    @Query(
        value = """
        SELECT mission
        FROM MissionModel mission
        WHERE
            mission.isDeleted = false AND
            mission.id IN :ids
        ORDER BY mission.startDateTimeUtc DESC
        """,
    )
    fun findNotDeletedByIds(ids: List<Int>): List<MissionModel>

    @EntityGraph(value = "MissionModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)
    @Query(
        "SELECT mission FROM MissionModel mission JOIN mission.controlUnits missionControlUnitResources WHERE missionControlUnitResources.unit.id = :controlUnitId",
    )
    fun findByControlUnitId(controlUnitId: Int): List<MissionModel>

    @EntityGraph(value = "MissionModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)
    @Query(
        "SELECT mission FROM MissionModel mission JOIN mission.controlResources missionControlUnitResources WHERE missionControlUnitResources.resource.id = :controlUnitResourceId",
    )
    fun findByControlUnitResourceId(controlUnitResourceId: Int): List<MissionModel>

    @EntityGraph(value = "MissionModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)
    @Query(
        """
        SELECT mission
        FROM MissionModel mission
        JOIN FETCH mission.envActions envAction
        WHERE mission.isDeleted = false
            AND envAction.actionStartDateTime IS NOT NULL
            AND envAction.geom IS NOT NULL
            AND ST_INTERSECTS(ST_SETSRID(envAction.geom, 4326), ST_SETSRID(:geometry, 4326))
            AND (mission.startDateTimeUtc BETWEEN CAST(CAST(:from AS text) AS timestamp) AND CAST(CAST(:to AS text) AS timestamp)
                OR mission.endDateTimeUtc BETWEEN CAST(CAST(:from AS text) AS timestamp) AND CAST(CAST(:to AS text) AS timestamp))
        """,
    )
    fun findAllByGeometryAndDateRange(
        geometry: Geometry,
        from: Instant?,
        to: Instant?,
    ): List<MissionModel>

    @EntityGraph(value = "MissionModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)
    @Query(
        "SELECT mission FROM MissionModel mission JOIN mission.envActions envActions WHERE envActions.id = :envActionId",
    )
    fun findByEnvActionId(envActionId: UUID): MissionModel?
}
