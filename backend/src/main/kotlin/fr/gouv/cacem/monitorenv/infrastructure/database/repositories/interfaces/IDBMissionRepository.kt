package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

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
        SELECT m.*
        FROM missions m
        WHERE
            deleted = false
            AND
            ((:controlUnitIds)::integer[] IS NULL
                OR EXISTS (SELECT 1 FROM missions_control_units mcu WHERE mcu.mission_id = m.id AND mcu.control_unit_id = ANY(:controlUnitIds) ))
            AND
            ((:missionTypeAIR IS FALSE AND :missionTypeLAND IS FALSE AND :missionTypeSEA IS FALSE)
                OR (
                (:missionTypeAIR IS TRUE AND mission_types::text like '%AIR%')
                OR
                (:missionTypeLAND IS TRUE AND mission_types::text like '%LAND%')
                OR
                (:missionTypeSEA IS TRUE AND mission_types::text like '%SEA%')
            ))
            AND
             (
                (start_datetime_utc >= CAST(:startedAfter AS timestamp)
                    AND (
                        CAST(:startedBefore AS timestamp) IS NULL
                        OR start_datetime_utc <= CAST(:startedBefore AS timestamp)
                    )
                )
                OR (
                    end_datetime_utc >= CAST(:startedAfter AS timestamp)
                    AND (
                        CAST(:startedBefore AS timestamp) IS NULL
                        OR end_datetime_utc <= CAST(:startedBefore AS timestamp)
                    )
                )
            )
            AND ((:seaFronts)::text[] IS NULL OR facade = ANY((:seaFronts)::text[]))
            AND (
                (:missionStatuses)::text[] IS NULL
                OR (
                    'UPCOMING' = ANY((:missionStatuses)::text[]) AND (
                    start_datetime_utc >= CAST(now() AS timestamp)
                    ))
                OR (
                    'PENDING' = ANY((:missionStatuses)::text[]) AND (
                    (end_datetime_utc IS NULL OR end_datetime_utc >= CAST(now() AS timestamp))
                    AND (start_datetime_utc <= CAST(now() AS timestamp))
                    )
                )
                OR (
                    'ENDED' = ANY((:missionStatuses)::text[]) AND (
                    end_datetime_utc < CAST(now() AS timestamp)
                    )
                )

            )
            AND ((:missionSources)::mission_source_type[] IS NULL
                OR mission_source = ANY((:missionSources)::mission_source_type[])
            )

            AND ((:searchQuery) = ''
                OR (
                   EXISTS (
                        SELECT 1 FROM env_actions e, LATERAL jsonb_array_elements(e.value->'infractions') AS infractions WHERE e.mission_id = m.id
                        AND to_tsvector('mydict',
                            COALESCE(infractions->>'imo', '') || ' ' ||
                            COALESCE(infractions->>'mmsi', '') || ' ' ||
                            COALESCE(infractions->>'registrationNumber', '') || ' ' ||
                            COALESCE(infractions->>'vesselName', '') || ' ' ||
                            COALESCE(infractions->>'companyName', '') || ' ' ||
                            COALESCE(infractions->>'controlledPersonIdentity', ''))
                         @@ plainto_tsquery('mydict', (:searchQuery || ':*'))
                        )
                    )
                )

        ORDER BY start_datetime_utc DESC
        """,
        nativeQuery = true,
    )
    fun findAll(
        controlUnitIds: Array<Int>? = null,
        missionStatuses: Array<String>? = null,
        missionSources: Array<String>? = null,
        missionTypeAIR: Boolean,
        missionTypeLAND: Boolean,
        missionTypeSEA: Boolean,
        pageable: Pageable,
        seaFronts: Array<String>? = null,
        startedAfter: Instant,
        startedBefore: Instant?,
        searchQuery: String,
    ): List<MissionModel>

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

    @EntityGraph(value = "MissionModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)
    @Query("SELECT mm FROM MissionModel mm JOIN mm.controlUnits mmcu WHERE mmcu.unit.id = :controlUnitId")
    fun findByControlUnitId(controlUnitId: Int): List<MissionModel>

    @EntityGraph(value = "MissionModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)
    @Query(
        "SELECT mm FROM MissionModel mm JOIN mm.controlResources mmcr WHERE mmcr.resource.id = :controlUnitResourceId",
    )
    fun findByControlUnitResourceId(controlUnitResourceId: Int): List<MissionModel>
}
