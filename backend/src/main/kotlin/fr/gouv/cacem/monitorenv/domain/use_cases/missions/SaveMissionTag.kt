package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionTagsRepository
import org.slf4j.LoggerFactory

@UseCase
class SaveMissionTag(
    private val missionTagsRepository: IMissionTagsRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveMissionTag::class.java)

    fun execute(missionTagEntity: MissionTagEntity): MissionTagEntity {
        logger.info(
            "Attempt to ${if (missionTagEntity.id === null) "create a mission tag" else "update with id ${missionTagEntity.id}"}",
        )
        val savedTag = missionTagsRepository.save(missionTagEntity)
        logger.info("Mission Tag ${missionTagEntity.id} saved")

        return savedTag
    }
}
