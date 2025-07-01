package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SuspicionOfOffense
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class GetSuspicionOfOffenseByMmsi(
    private val reportingRepository: IReportingRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(GetSuspicionOfOffenseByMmsi::class.java)

    fun execute(mmsi: String): SuspicionOfOffense {
        logger.info("Attempt to find envAction with mmsi $mmsi")

        val suspicionOfOffense = reportingRepository.findNbOfSuspicionOfOffense(mmsi)

        logger.info("Found ${suspicionOfOffense.amount} suspicions of offense.")

        return suspicionOfOffense
    }
}
