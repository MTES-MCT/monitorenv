package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionsDTO
import java.time.Instant

interface IMissionRepository {
    fun count(): Long

    fun delete(missionId: Int)

    fun findFullMissionById(missionId: Int): MissionDTO?

    fun findById(missionId: Int): MissionEntity?

    fun findAllFullMissions(
        controlUnitIds: List<Int>? = null,
        missionSources: List<MissionSourceEnum>? = null,
        missionStatuses: List<String>?,
        missionTypes: List<MissionTypeEnum>?,
        pageNumber: Int?,
        pageSize: Int?,
        seaFronts: List<String>?,
        startedAfter: Instant,
        startedBefore: Instant?,
        searchQuery: String?,
    ): List<MissionsDTO>

    fun findAll(
        controlUnitIds: List<Int>? = null,
        missionSources: List<MissionSourceEnum>? = null,
        missionStatuses: List<String>?,
        missionTypes: List<MissionTypeEnum>?,
        pageNumber: Int?,
        pageSize: Int?,
        seaFronts: List<String>?,
        startedAfter: Instant,
        startedBefore: Instant?,
        searchQuery: String?,
    ): List<MissionEntity>

    fun findByIds(ids: List<Int>): List<MissionEntity>

    fun findByControlUnitId(controlUnitId: Int): List<MissionEntity>

    fun findByControlUnitResourceId(controlUnitResourceId: Int): List<MissionEntity>

    fun save(mission: MissionEntity): MissionDTO
}
