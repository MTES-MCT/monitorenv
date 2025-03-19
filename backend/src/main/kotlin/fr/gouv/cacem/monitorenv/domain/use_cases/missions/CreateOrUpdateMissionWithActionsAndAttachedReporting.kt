@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.ReportingAlreadyAttachedException
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.EnvActionAttachedToReportingIds
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.validators.UseCaseValidation
import fr.gouv.cacem.monitorenv.domain.validators.mission.MissionWithEnvActionsValidator
import org.slf4j.LoggerFactory
import java.util.UUID

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
        @UseCaseValidation<MissionEntity>(validator = MissionWithEnvActionsValidator::class)
        mission: MissionEntity,
        attachedReportingIds: List<Int>,
        envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>,
    ): Pair<Boolean, MissionDetailsDTO> {
        logger.info(
            "Attempt to CREATE or UPDATE mission: ${mission.id} with attached reporting ids: $attachedReportingIds and env actions attached to reporting ids: $envActionsAttachedToReportingIds",
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

        logger.info(
            "Mission: ${mission.id} with attached reporting ids: $attachedReportingIds and env actions attached to reporting ids: $envActionsAttachedToReportingIds created or updated",
        )

        if (mission.id == null) {
            val newMission = getFullMission.execute(savedMission.id)
            return Pair(true, newMission.copy(fishActions = listOf(), hasRapportNavActions = null))
        }

        return getFullMissionWithFishAndRapportNavActions.execute(savedMission.id)
    }

    private fun getListOfEnvActionIds(
        envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>?,
    ): List<UUID> =
        envActionsAttachedToReportingIds?.filter { it.second.isNotEmpty() }?.map { it.first }
            ?: emptyList()
}
