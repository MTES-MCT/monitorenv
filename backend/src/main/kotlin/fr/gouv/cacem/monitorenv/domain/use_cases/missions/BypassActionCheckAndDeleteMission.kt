@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import java.time.ZonedDateTime

@UseCase
class BypassActionCheckAndDeleteMission(
    private val missionRepository: IMissionRepository,
    private val reportingRepository: IReportingRepository,
) {
    @Throws(IllegalArgumentException::class)
    fun execute(missionId: Int?) {
        require(missionId != null) { "No mission to delete" }

        val missionToDelete = missionRepository.findFullMissionById(missionId)

        if (missionToDelete.attachedReportingIds?.isNotEmpty() == true) {
            missionToDelete.attachedReportingIds.forEach {
                val reporting = reportingRepository.findById(it)

                // detach action attached to reporting
                if (reporting.reporting.attachedEnvActionId != null) {
                    reportingRepository.detachDanglingEnvActions(
                        missionId,
                        listOf(reporting.reporting.attachedEnvActionId),
                    )
                }

                // detach mission to reporting
                val detachedReporting = reporting.reporting.copy(
                    detachedFromMissionAtUtc = ZonedDateTime.now(),
                    attachedEnvActionId = null,
                )
                reportingRepository.save(detachedReporting)
            }
        }

        return missionRepository.delete(missionId)
    }
}
