@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.monitorfish.GetFishMissionActionsById
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.ErrorCode
import org.slf4j.LoggerFactory

@UseCase
class DeleteMission(
    private val missionRepository: IMissionRepository,
    private val getFishMissionActionsById: GetFishMissionActionsById,
) {
    private val logger = LoggerFactory.getLogger(GetFullMissions::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(missionId: Int?, source: MissionSourceEnum? = null) {
        require(missionId != null) {
            "No mission to delete"
        }
        logger.info("source $source")
        if (source === MissionSourceEnum.MONITORFISH) {
            val envActions = missionRepository.findById(missionId).envActions

            if (envActions?.isNotEmpty()!!) {
                throw BackendUsageException(
                    ErrorCode.EXISTING_MISSION_ACTION,
                    Pair("sources", listOf(MissionSourceEnum.MONITORENV)),
                )
            }
        }

        val fishActions = getFishMissionActionsById.execute(missionId)
        if (fishActions.isNotEmpty()) {
            throw BackendUsageException(
                ErrorCode.EXISTING_MISSION_ACTION,
                Pair("sources", listOf(MissionSourceEnum.MONITORFISH)),
            )
        }

        return missionRepository.delete(missionId)
    }
}
