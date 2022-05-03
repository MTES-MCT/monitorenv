package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.NewMissionEntity

interface IMissionRepository {
    fun findMissionById(missionId: Int): MissionEntity
    fun findMissions(): List<MissionEntity>
    fun save(mission: MissionEntity) : MissionEntity
    fun create(mission: MissionEntity) : MissionEntity
}
