package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionTagsRepository
import org.slf4j.LoggerFactory

@UseCase
class GetMissionTags(
    private val missionTagsRepository: IMissionTagsRepository,
) {
    private val logger = LoggerFactory.getLogger(GetMissionTags::class.java)

    fun execute(): List<MissionTagEntity> {
        logger.info("Attempt to GET all mission tags")

        val missionTags = missionTagsRepository.findAll()

        logger.info("Found ${missionTags.size} mission tags")

        return missionTags
    }
}
