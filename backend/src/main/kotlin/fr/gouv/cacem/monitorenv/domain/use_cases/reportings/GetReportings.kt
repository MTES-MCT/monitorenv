package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingsDTO
import org.slf4j.LoggerFactory
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
        targetTypes: List<TargetTypeEnum>?,
        isAttachedToMission: Boolean?,
        searchQuery: String?,
    ): List<ReportingsDTO> {
        logger.info("Attempt to get reportings with criteria")
        val now = ZonedDateTime.now()
        val reports =
            reportingRepository.findAll(
                reportingType = reportingType,
                seaFronts = seaFronts,
                sourcesType = sourcesType,
                startedAfter =
                    startedAfterDateTime?.toInstant()
                        ?: now.minusDays(30).toInstant(),
                startedBefore = startedBeforeDateTime?.toInstant(),
                status = status,
                targetTypes = targetTypes,
                isAttachedToMission = isAttachedToMission,
                pageNumber = pageNumber,
                pageSize = pageSize,
                searchQuery = searchQuery,
            )
        logger.info("Found ${reports.size} reportings with criteria")

        return reports
    }
}
