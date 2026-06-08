package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity

interface IMissionTagMissionsRepository {
    fun saveAll(
        mission: MissionEntity,
        missionTags: List<MissionTagEntity>,
    ): List<MissionTagEntity>
}
