package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import java.time.Instant
import org.springframework.data.domain.Pageable

interface IMissionRepository {
    fun findFullMissionById(missionId: Int): MissionDTO
    fun findById(missionId: Int): MissionEntity
    fun findAllFullMissions(
            startedAfter: Instant,
            startedBefore: Instant?,
            missionTypes: List<String>?,
            missionStatuses: List<String>?,
            missionSources: List<MissionSourceEnum>? = null,
            seaFronts: List<String>?,
            pageable: Pageable,
    ): List<MissionDTO>
    fun findByControlUnitId(controlUnitId: Int): List<MissionEntity>
    fun findAll(
            startedAfter: Instant,
            startedBefore: Instant?,
            missionTypes: List<String>?,
            missionStatuses: List<String>?,
            missionSources: List<MissionSourceEnum>? = null,
            seaFronts: List<String>?,
            pageable: Pageable,
    ): List<MissionEntity>
    fun save(mission: MissionEntity): MissionDTO
}
