package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.time.Instant

@DynamicUpdate
interface IDBMissionRepository : JpaRepository<MissionModel, Int> {
    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        UPDATE missions
        SET deleted = TRUE
        WHERE id = :id
    """,
        nativeQuery = true,
    )
    fun delete(id: Int)

    // see https://github.com/spring-projects/spring-data-jpa/issues/2491
    // and https://stackoverflow.com/questions/55169797/pass-liststring-into-postgres-function-as-parameter
    // for ugly casting of passed parameters

    @EntityGraph(value = "MissionModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)
    @Query(
        """
        SELECT mission
        FROM MissionModel mission
        WHERE
            (:controlUnitIds IS NULL OR EXISTS (SELECT c FROM mission.controlUnits c WHERE c.unit.id IN :controlUnitIds))
            AND
            ((:missionTypeAIR = FALSE AND :missionTypeLAND = FALSE AND :missionTypeSEA = FALSE) OR (
                (:missionTypeAIR = TRUE AND (  CAST(mission.missionTypes as String) like '%AIR%'))
                OR
                (:missionTypeLAND = TRUE AND (  CAST(mission.missionTypes as String) like '%LAND%'))
                OR
                (:missionTypeSEA = TRUE AND (  CAST(mission.missionTypes as String) like '%SEA%'))
            ))
            AND
            mission.isDeleted = false
            AND (
                mission.startDateTimeUtc >= :startedAfter
                AND (CAST(:startedBefore AS timestamp) IS NULL OR mission.startDateTimeUtc <= CAST(:startedBefore AS timestamp))
                OR (
                    mission.endDateTimeUtc >= :startedAfter
                    AND (CAST(:startedBefore AS timestamp) IS NULL OR mission.endDateTimeUtc <= CAST(:startedBefore AS timestamp))
                )
            )
            AND (:seaFronts IS NULL OR mission.facade IN :seaFronts)
            AND (
                :missionStatuses IS NULL
                OR (
                    'UPCOMING' IN :missionStatuses AND (
                    mission.startDateTimeUtc >= now()
                    AND mission.isClosed = FALSE
                    ))
                OR (
                    'PENDING' IN :missionStatuses AND (
                    (mission.endDateTimeUtc IS NULL OR mission.endDateTimeUtc >= now())
                    AND (mission.startDateTimeUtc <= now())
                    AND mission.isClosed = FALSE
                    )
                )
                OR (
                    'ENDED' IN :missionStatuses AND (
                    mission.endDateTimeUtc < now()
                    AND mission.isClosed = FALSE
                    )
                )
                OR (
                    'CLOSED' IN :missionStatuses AND (
                    mission.isClosed = TRUE
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
        controlUnitIds: List<Int>? = emptyList<Int>(),
        missionStatuses: List<String>? = emptyList<String>(),
        missionSources: List<MissionSourceEnum>? = emptyList<MissionSourceEnum>(),
        missionTypeAIR: Boolean,
        missionTypeLAND: Boolean,
        missionTypeSEA: Boolean,
        pageable: Pageable,
        seaFronts: List<String>? = emptyList<String>(),
        startedAfter: Instant,
        startedBefore: Instant?,
    ): List<MissionModel>
    // missionTypes: List<String>? = emptyList<String>(),

    @Query(
        value = """
        SELECT *
        FROM missions
        WHERE
            deleted IS FALSE AND
            id IN :ids
        ORDER BY start_datetime_utc DESC
        """,
        nativeQuery = true,
    )
    fun findNotDeletedByIds(ids: List<Int>): List<MissionModel>

    @Query("SELECT mm FROM MissionModel mm JOIN mm.controlUnits mmcu WHERE mmcu.unit.id = :controlUnitId")
    fun findByControlUnitId(controlUnitId: Int): List<MissionModel>

    @Query(
        "SELECT mm FROM MissionModel mm JOIN mm.controlResources mmcr WHERE mmcr.resource.id = :controlUnitResourceId",
    )
    fun findByControlUnitResourceId(controlUnitResourceId: Int): List<MissionModel>
}
