package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import org.hibernate.annotations.DynamicUpdate
import org.locationtech.jts.geom.Geometry
import org.springframework.data.domain.Pageable
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
            AND (
                    (CAST(:startedAfter AS text) IS NULL OR mission.endDateTimeUtc >= CAST(CAST(:startedAfter AS text) AS timestamp))
                AND 
                    (CAST(:startedBefore as text) IS NULL OR mission.startDateTimeUtc <= CAST(CAST(:startedBefore AS text) AS timestamp))
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

    @Query(
        "SELECT mission FROM MissionModel mission JOIN mission.controlUnits missionControlUnitResources WHERE missionControlUnitResources.unit.id = :controlUnitId",
    )
    fun findByControlUnitId(controlUnitId: Int): List<MissionModel>

    @Query(
        "SELECT mission FROM MissionModel mission JOIN mission.controlResources missionControlUnitResources WHERE missionControlUnitResources.resource.id = :controlUnitResourceId",
    )
    fun findByControlUnitResourceId(controlUnitResourceId: Int): List<MissionModel>

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

    @Query(
        "SELECT mission FROM MissionModel mission JOIN mission.envActions envActions WHERE envActions.id = :envActionId",
    )
    fun findByEnvActionId(envActionId: UUID): MissionModel?
}
