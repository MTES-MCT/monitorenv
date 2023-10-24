package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.springframework.data.domain.Pageable
import java.time.Instant

interface IMissionRepository {
    fun count(): Long

    fun delete(missionId: Int)

    fun findAll(
        startedAfter: Instant,
        startedBefore: Instant?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
        missionSources: List<MissionSourceEnum>? = null,
        seaFronts: List<String>?,
        pageable: Pageable,
    ): List<MissionDTO>

    fun findAllIncludedIn(ids: List<Int>): List<MissionEntity>

    fun findByControlUnitId(controlUnitId: Int): List<MissionEntity>

    fun findById(missionId: Int): MissionDTO

    fun save(mission: MissionEntity): MissionDTO
}
