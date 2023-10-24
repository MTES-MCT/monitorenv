package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.repositories.*
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.time.ZonedDateTime

@UseCase
class CreateOrUpdateReporting(
    private val reportingRepository: IReportingRepository,
    private val controlUnitRepository: IControlUnitRepository,
    private val semaphoreRepository: ISemaphoreRepository,
    private val facadeRepository: IFacadeAreasRepository,
    private val missionRepository: IMissionRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(CreateOrUpdateReporting::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(reporting: ReportingEntity?): ReportingDTO {
        require(reporting != null) { "No reporting to create or update" }
        logger.info("Create or update reporting: $reporting.id")
        reporting.checkValidity()

        var seaFront: String? = null
        if (reporting.geom != null) {
            seaFront = facadeRepository.findFacadeFromGeometry(reporting.geom)
        }

        var attachedToMissionAtUtc: ZonedDateTime? = null
        var detachedFromMissionAtUtc: ZonedDateTime? = null
        if (reporting.missionId != null) {
            // TO CHECK if the date is with or without UTC
            attachedToMissionAtUtc = ZonedDateTime.now()
            detachedFromMissionAtUtc = null
        }

        if (reporting.missionId == null && reporting.attachedToMissionAtUtc != null) {
            detachedFromMissionAtUtc = ZonedDateTime.now()
        }

        val savedReport =
            reportingRepository.save(
                reporting.copy(
                    seaFront = seaFront,
                    attachedToMissionAtUtc = attachedToMissionAtUtc,
                    detachedFromMissionAtUtc = detachedFromMissionAtUtc,
                ),
            )

        return savedReport
    }
}
