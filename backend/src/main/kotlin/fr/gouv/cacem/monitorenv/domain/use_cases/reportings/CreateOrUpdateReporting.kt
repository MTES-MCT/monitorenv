package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ILegacyControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateReporting(
    private val reportingRepository: IReportingRepository,
    private val controlUnitRepository: ILegacyControlUnitRepository,
    private val semaphoreRepository: ISemaphoreRepository,
    private val facadeRepository: IFacadeAreasRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(CreateOrUpdateReporting::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(reporting: ReportingEntity?): Triple<ReportingEntity, LegacyControlUnitEntity?, SemaphoreEntity?> {
        require(reporting != null) {
            "No reporting to create or update"
        }
        logger.info("Create or update reporting: $reporting.id")
        reporting.checkValidity()

        var seaFront: String? = null
        if (reporting.geom != null) {
            seaFront = facadeRepository.findFacadeFromGeometry(reporting.geom)
        }

        val savedReport = reportingRepository.save(reporting.copy(seaFront = seaFront))

        val controlUnit =
            if (savedReport.controlUnitId != null) controlUnitRepository.findById(savedReport.controlUnitId) else null
        val semaphore =
            if (savedReport.semaphoreId != null) semaphoreRepository.findById(savedReport.semaphoreId) else null

        return Triple(savedReport, controlUnit, semaphore)
    }
}
