package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import org.slf4j.LoggerFactory

@UseCase
class GetMissionsByIds(
    private val missionRepository: IMissionRepository,
) {
    private val logger = LoggerFactory.getLogger(GetMissions::class.java)

    fun execute(ids: List<Int>): List<MissionEntity> {
        logger.info("GET missions $ids")
        val missions = missionRepository.findByIds(ids)
        missions.forEach { mission ->
            missionRepository.addLegacyControlPlans(mission)
        }
        return missions
    }
}
