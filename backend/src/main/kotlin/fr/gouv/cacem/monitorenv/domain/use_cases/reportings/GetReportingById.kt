package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class GetReportingById(
    private val reportingRepository: IReportingRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(DeleteReportings::class.java)

    fun execute(id: Int): ReportingDetailsDTO {
        logger.info("GET reporting $id")

        return reportingRepository.findById(id)
    }
}
