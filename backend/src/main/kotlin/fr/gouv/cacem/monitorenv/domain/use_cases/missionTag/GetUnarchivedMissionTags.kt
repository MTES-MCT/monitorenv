package fr.gouv.cacem.monitorenv.domain.use_cases.missionTag

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionTagsRepository
import org.slf4j.LoggerFactory

@UseCase
class GetUnarchivedMissionTags(
    private val missionTagsRepository: IMissionTagsRepository,
) {
    private val logger = LoggerFactory.getLogger(GetUnarchivedMissionTags::class.java)

    fun execute(): List<MissionTagEntity> {
        logger.info("Attempt to GET all unarchived mission tags")

        val missionTags = missionTagsRepository.findAllUnarchived()

        logger.info("Found ${missionTags.size} mission tags")

        return missionTags
    }
}
