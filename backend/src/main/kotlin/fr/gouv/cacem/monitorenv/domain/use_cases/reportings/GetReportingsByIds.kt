package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import org.slf4j.LoggerFactory

@UseCase
class GetReportingsByIds(
    private val reportingRepository: IReportingRepository,
) {
    private val logger = LoggerFactory.getLogger(GetReportingsByIds::class.java)

    fun execute(ids: List<Int>): List<ReportingDetailsDTO> {
        logger.info("GET reportings $ids")
        val reportings = reportingRepository.findAllById(ids)

        return reportings
    }
}
