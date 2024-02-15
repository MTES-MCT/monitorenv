@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import java.time.ZonedDateTime
import java.util.UUID

@UseCase
class DeleteMission(
    private val missionRepository: IMissionRepository,
    private val reportingRepository: IReportingRepository,
) {
    @Throws(IllegalArgumentException::class)
    fun execute(missionId: Int?) {
        require(missionId != null) { "No mission to delete" }

        val missionToDelete = missionRepository.findFullMissionById(missionId)

        if (missionToDelete.attachedReportingIds?.isNotEmpty() == true) {
            val envActionIdsToDetach = mutableListOf<UUID>()
            missionToDelete.attachedReportingIds.forEach {
                val reporting = reportingRepository.findById(it)

                // detach action attached to reporting
                if (reporting.reporting.attachedEnvActionId != null) {
                    envActionIdsToDetach.add(reporting.reporting.attachedEnvActionId)
                }

                // detach mission to reporting
                val detachedReporting = reporting.reporting.copy(
                    detachedFromMissionAtUtc = ZonedDateTime.now(),
                    attachedEnvActionId = null,
                )
                reportingRepository.save(detachedReporting)
            }
            reportingRepository.detachDanglingEnvActions(
                missionId,
                envActionIdsToDetach,
            )
        }

        return missionRepository.delete(missionId)
    }
}
