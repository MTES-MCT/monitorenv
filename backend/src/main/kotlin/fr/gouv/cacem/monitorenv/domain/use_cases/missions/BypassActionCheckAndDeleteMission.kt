@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class BypassActionCheckAndDeleteMission(
    private val getFullMission: GetFullMission,
    private val missionRepository: IMissionRepository,
    private val reportingRepository: IReportingRepository,
) {
    private val logger = LoggerFactory.getLogger(BypassActionCheckAndDeleteMission::class.java)

    fun execute(missionId: Int) {
        logger.info("Attempt to DELETE mission $missionId without checking actions")
        val missionToDelete = getFullMission.execute(missionId)
        missionToDelete.attachedReportingIds?.let { attachedReportingIds ->
            if (attachedReportingIds.isNotEmpty()) {
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
                    val detachedReporting =
                        reporting.reporting.copy(
                            detachedFromMissionAtUtc = ZonedDateTime.now(),
                            attachedEnvActionId = null,
                        )
                    reportingRepository.save(detachedReporting)
                }
            }
            missionRepository.delete(missionId)
            logger.info("Mission $missionId deleted")
        }
    }
}
