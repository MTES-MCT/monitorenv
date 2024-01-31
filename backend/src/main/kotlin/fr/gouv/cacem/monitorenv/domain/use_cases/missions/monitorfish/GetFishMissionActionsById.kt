package fr.gouv.cacem.monitorenv.domain.use_cases.missions.monitorfish

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.FishAction
import fr.gouv.cacem.monitorenv.domain.repositories.IFishMissionActionsRepository
import org.slf4j.LoggerFactory
@UseCase
class GetFishMissionActionsById(
    private val fishMissionActionsRepository: IFishMissionActionsRepository,
) {
    private val logger = LoggerFactory.getLogger(GetFishMissionActionsById::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(missionId: Int?): List<FishAction> {
        require(missionId != null) {
            "No id to get mission"
        }

        return fishMissionActionsRepository.findFishMissionActionsById(missionId)
    }
}
