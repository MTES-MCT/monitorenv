package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class GetReportingsByMmsi(
    private val reportingRepository: IReportingRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(GetReportingsByMmsi::class.java)

    fun execute(mmsi: String): List<ReportingDetailsDTO> {
        logger.info("Attempt to find reportings with mmsi $mmsi")

        val reportings = reportingRepository.findAllByMmsi(mmsi)

        logger.info("Found ${reportings.size} reportings from mmsi $mmsi.")

        return reportings
    }
}
