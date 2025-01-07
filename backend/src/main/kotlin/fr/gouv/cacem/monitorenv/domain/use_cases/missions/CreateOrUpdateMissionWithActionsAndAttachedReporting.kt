@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.*
import fr.gouv.cacem.monitorenv.domain.exceptions.ReportingAlreadyAttachedException
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.EnvActionAttachedToReportingIds
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.slf4j.LoggerFactory
import java.util.*

@UseCase
class CreateOrUpdateMissionWithActionsAndAttachedReporting(
    private val createOrUpdateMission: CreateOrUpdateMission,
    private val createOrUpdateEnvActions: CreateOrUpdateEnvActions,
    private val reportingRepository: IReportingRepository,
    private val getFullMissionWithFishAndRapportNavActions: GetFullMissionWithFishAndRapportNavActions,
    private val getFullMission: GetFullMission,
) {
    private val logger =
        LoggerFactory.getLogger(
            CreateOrUpdateMissionWithActionsAndAttachedReporting::class.java,
        )

    @Throws(IllegalArgumentException::class)
    fun execute(
        mission: MissionEntity,
        attachedReportingIds: List<Int>,
        envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>,
    ): Pair<Boolean, MissionDTO> {
        logger.info(
            "Create or update mission: ${mission.id} with attached reporting ids: $attachedReportingIds and env actions attached to reporting ids: $envActionsAttachedToReportingIds",
        )
        if (mission.id != null) {
            reportingRepository.detachDanglingEnvActions(
                mission.id,
                getListOfEnvActionIds(envActionsAttachedToReportingIds),
            )
        }

        val savedMission = createOrUpdateMission.execute(mission)
        require(savedMission.id != null) { "The mission id is null" }

        createOrUpdateEnvActions.execute(
            savedMission,
            mission.envActions,
        )

        attachedReportingIds.forEach {
            val reporting = reportingRepository.findById(it)
            if (reporting.reporting.missionId != null &&
                reporting.reporting.attachedToMissionAtUtc != null &&
                reporting.reporting.detachedFromMissionAtUtc == null &&
                reporting.reporting.missionId != savedMission.id
            ) {
                throw ReportingAlreadyAttachedException(
                    "Reporting ${reporting.reporting.id} is already attached to a mission",
                )
            }
        }

        reportingRepository.attachReportingsToMission(attachedReportingIds, savedMission.id)
        envActionsAttachedToReportingIds.forEach {
            reportingRepository.attachEnvActionsToReportings(it.first, it.second)
        }

        if (mission.id == null) {
            val newMission = getFullMission.execute(savedMission.id)
            return Pair(true, newMission.copy(fishActions = listOf(), hasRapportNavActions = null))
        }

        return getFullMissionWithFishAndRapportNavActions.execute(savedMission.id)
    }

    private fun getListOfEnvActionIds(
        envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>?,
    ): List<UUID> {
        return envActionsAttachedToReportingIds?.filter { it.second.isNotEmpty() }?.map { it.first }
            ?: emptyList()
    }
}
