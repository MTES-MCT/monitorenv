package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSourceEnum
import org.springframework.data.domain.Pageable
import java.time.Instant

interface IMissionRepository {
    fun findById(missionId: Int): MissionEntity
    fun findAll(
        startedAfter: Instant,
        startedBefore: Instant?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
        missionSources: List<MissionSourceEnum>? = null,
        seaFronts: List<String>?,
        pageable: Pageable,
    ): List<MissionEntity>
    fun save(mission: MissionEntity): MissionEntity
    fun delete(missionId: Int)
    fun count(): Long
}
