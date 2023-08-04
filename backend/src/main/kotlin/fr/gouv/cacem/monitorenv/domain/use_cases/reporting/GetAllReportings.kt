package fr.gouv.cacem.monitorenv.domain.use_cases.reporting

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import java.time.ZonedDateTime

@UseCase
class GetAllReportings(
    private val reportingRepository: IReportingRepository,
    private val controlUnitRepository: IControlUnitRepository,
    private val semaphoreRepository: ISemaphoreRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllReportings::class.java)

    fun execute(
        pageNumber: Int?,
        pageSize: Int?,
        provenStatus: List<String>?,
        reportingType: List<ReportingTypeEnum>?,
        seaFronts: List<String>?,
        sourcesType: List<SourceTypeEnum>?, 
        startedAfterDateTime: ZonedDateTime?,
        startedBeforeDateTime: ZonedDateTime?,
        status: List<String>?,
    ): List<Triple<ReportingEntity, ControlUnitEntity?, SemaphoreEntity?>> {
        val reports = reportingRepository.findAll(
            provenStatus = provenStatus,
            reportingType = reportingType,
            seaFronts = seaFronts,
            sourcesType = sourcesType, 
            startedAfter = startedAfterDateTime?.toInstant() ?: ZonedDateTime.now().minusDays(30).toInstant(),
            startedBefore = startedBeforeDateTime?.toInstant(),
            status = status,
            pageable = if (pageNumber != null && pageSize != null) PageRequest.of(pageNumber, pageSize) else Pageable.unpaged(),
        )
        val controlUnits = controlUnitRepository.findAll()
        val semaphores = semaphoreRepository.findAll()

        logger.info("Found ${reports.size} reportings, ${controlUnits.size} control units and ${semaphores.size} semaphores")

        return reports.map { reporting ->
            return@map Triple(
                reporting,
                controlUnits.find { it.id == reporting.controlUnitId },
                semaphores.find { it.id == reporting.semaphoreId },
            )
        }
    }
}
