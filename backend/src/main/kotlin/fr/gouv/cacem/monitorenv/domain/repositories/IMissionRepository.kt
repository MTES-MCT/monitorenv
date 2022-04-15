package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionsListEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity

interface IMissionRepository {
    fun findMissionById(missionId: Int): MissionEntity
    fun findMissions(): MissionsListEntity
    fun save(mission: MissionEntity)
}
