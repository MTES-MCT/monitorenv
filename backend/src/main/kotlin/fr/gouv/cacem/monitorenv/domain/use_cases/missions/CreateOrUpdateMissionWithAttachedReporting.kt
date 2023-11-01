@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.*
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.EnvActionAttachedToReportingIds

@UseCase
class CreateOrUpdateMissionWithAttachedReporting(
    private val createOrUpdateMission: CreateOrUpdateMission,
    private val missionRepository: IMissionRepository,
    private val reportingRepository: IReportingRepository
) {
    @Throws(IllegalArgumentException::class)
    fun execute(
        mission: MissionEntity?,
        attachedReportingIds: List<Int>,
        envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>
    ): MissionDTO {
        val savedMission = createOrUpdateMission.execute(mission)
        require(savedMission.id != null) { "The mission id is null" }

        reportingRepository.attachReportingsToMission(attachedReportingIds, savedMission.id)

        envActionsAttachedToReportingIds.forEach {
            reportingRepository.attachEnvActionsToReportings(it.first, it.second)
        }

        return missionRepository.findFullMissionById(savedMission.id)
    }
}
