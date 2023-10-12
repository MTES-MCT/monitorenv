package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.FullReportingDTO
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import java.time.ZonedDateTime

@UseCase
class GetReportings(
    private val reportingRepository: IReportingRepository,
) {
    private val logger = LoggerFactory.getLogger(GetReportings::class.java)

    fun execute(
        pageNumber: Int?,
        pageSize: Int?,
        reportingType: List<ReportingTypeEnum>?,
        seaFronts: List<String>?,
        sourcesType: List<SourceTypeEnum>?,
        startedAfterDateTime: ZonedDateTime?,
        startedBeforeDateTime: ZonedDateTime?,
        status: List<String>?,
    ): List<FullReportingDTO> {
        val reports =
            reportingRepository.findAll(
                reportingType = reportingType,
                seaFronts = seaFronts,
                sourcesType = sourcesType,
                startedAfter = startedAfterDateTime?.toInstant()
                    ?: ZonedDateTime.now().minusDays(30).toInstant(),
                startedBefore = startedBeforeDateTime?.toInstant(),
                status = status,
                pageable =
                if (pageNumber != null && pageSize != null) {
                    PageRequest.of(pageNumber, pageSize)
                } else {
                    Pageable.unpaged()
                },
            )

        logger.info(
            "Found ${reports.size} reporting(s)",
        )

        return reports
    }
}
