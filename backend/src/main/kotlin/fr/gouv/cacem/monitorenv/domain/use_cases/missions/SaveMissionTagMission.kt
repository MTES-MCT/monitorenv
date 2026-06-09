package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import org.slf4j.LoggerFactory

@UseCase
class SaveMissionTagMission(
    private val missionRepository: IMissionRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveMissionTagMission::class.java)

    fun execute(
        mission: MissionEntity,
        missionTags: List<MissionTagEntity>,
    ): MissionEntity {
        logger.info(
            "Attempt to CREATE or UPDATE mission ${mission.id} with mission tags ${missionTags.map { it.id }}",
        )
        val missionToSave = mission.copy(missionTags = missionTags)
        val savedMission = missionRepository.save(missionToSave)
        logger.info(
            "Mission ${savedMission.mission.id} with mission tags ${missionTags.map { it.id }} created or updated",
        )

        return savedMission.mission
    }
}
