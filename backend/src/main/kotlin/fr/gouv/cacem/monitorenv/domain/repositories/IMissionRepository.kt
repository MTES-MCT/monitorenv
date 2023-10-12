package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.FullMissionDTO
import org.springframework.data.domain.Pageable
import java.time.Instant

interface IMissionRepository {
    fun findById(missionId: Int): FullMissionDTO
    fun findAll(
        startedAfter: Instant,
        startedBefore: Instant?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
        missionSources: List<MissionSourceEnum>? = null,
        seaFronts: List<String>?,
        pageable: Pageable,
    ): List<FullMissionDTO>

    fun save(mission: MissionEntity): FullMissionDTO
    fun delete(missionId: Int)
    fun count(): Long
}
