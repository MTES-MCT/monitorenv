package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity

interface IMissionTagsRepository {
    fun findAll(): List<MissionTagEntity>

    fun save(missionTagEntity: MissionTagEntity): MissionTagEntity
}
