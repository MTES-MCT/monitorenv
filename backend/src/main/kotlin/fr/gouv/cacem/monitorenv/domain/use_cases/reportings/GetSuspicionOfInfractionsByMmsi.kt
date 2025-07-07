package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SuspicionOfInfractions
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class GetSuspicionOfInfractionsByMmsi(
    private val reportingRepository: IReportingRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(GetSuspicionOfInfractionsByMmsi::class.java)

    fun execute(
        mmsi: String,
        idToExclude: Int?,
    ): SuspicionOfInfractions {
        logger.info("Attempt to find suspicions of infraction with mmsi $mmsi")

        val suspicionOfInfractions = reportingRepository.findSuspicionOfInfractionsByMmsi(mmsi, idToExclude)

        logger.info("Found ${suspicionOfInfractions.ids?.size ?: 0} suspicions of infraction.")

        return suspicionOfInfractions
    }
}
