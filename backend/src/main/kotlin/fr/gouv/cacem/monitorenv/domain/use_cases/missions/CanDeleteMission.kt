package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.ErrorCode
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import org.slf4j.LoggerFactory

@UseCase
class CanDeleteMission(
    private val missionRepository: IMissionRepository,
    private val monitorFishMissionActionsRepository: IMonitorFishMissionActionsRepository,
) {
    private val logger = LoggerFactory.getLogger(GetFullMissions::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(missionId: Int, source: MissionSourceEnum): Boolean {
        if (source == MissionSourceEnum.MONITORFISH) {
            val envActions = missionRepository.findById(missionId).envActions
            if (!envActions.isNullOrEmpty()) {
                val errorSources = object {
                    var sources = listOf(MissionSourceEnum.MONITORENV)
                }

                throw BackendUsageException(
                    ErrorCode.EXISTING_MISSION_ACTION,
                    errorSources,
                )
            }

            return true
        }

        val fishActions = monitorFishMissionActionsRepository.findFishMissionActionsById(missionId)
        if (fishActions.isNotEmpty()) {
            val errorSources = object {
                var sources = listOf(MissionSourceEnum.MONITORFISH)
            }
            throw BackendUsageException(
                ErrorCode.EXISTING_MISSION_ACTION,
                errorSources,
            )
        }

        return true
    }
}
