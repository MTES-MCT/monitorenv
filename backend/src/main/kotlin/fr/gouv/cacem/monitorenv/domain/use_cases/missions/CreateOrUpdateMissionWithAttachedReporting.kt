@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.*
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.EnvActionAttachedToReportingIds
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ReportingAlreadyAttachedException
import org.slf4j.LoggerFactory
import java.util.UUID

@UseCase
class CreateOrUpdateMissionWithAttachedReporting(
    private val createOrUpdateMission: CreateOrUpdateMission,
    private val createOrUpdateEnvActions: CreateOrUpdateEnvActions,
    private val missionRepository: IMissionRepository,
    private val reportingRepository: IReportingRepository,
) {
    private val logger =
        LoggerFactory.getLogger(CreateOrUpdateMissionWithAttachedReporting::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(
        mission: MissionEntity,
        attachedReportingIds: List<Int>,
        envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>,
    ): MissionDTO {
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

        return missionRepository.findFullMissionById(savedMission.id)
    }

    private fun getListOfEnvActionIds(
        envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>?,
    ): List<UUID> {
        return envActionsAttachedToReportingIds?.filter { it.second.isNotEmpty() }?.map { it.first }
            ?: emptyList()
    }
}
