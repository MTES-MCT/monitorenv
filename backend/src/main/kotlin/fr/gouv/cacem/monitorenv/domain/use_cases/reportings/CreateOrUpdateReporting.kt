package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.repositories.*
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ReportingAlreadyAttachedException
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateReporting(
    private val reportingRepository: IReportingRepository,
    private val facadeRepository: IFacadeAreasRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(CreateOrUpdateReporting::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(reporting: ReportingEntity?): ReportingDTO {
        require(reporting != null) { "No reporting to create or update" }
        logger.info("Create or update reporting: $reporting.id")
        reporting.validate()

        var seaFront: String? = null
        if (reporting.geom != null) {
            seaFront = facadeRepository.findFacadeFromGeometry(reporting.geom)
        }

        if (reporting.id != null &&
            reporting.attachedToMissionAtUtc != null &&
            reporting.missionId != null &&
            reporting.detachedFromMissionAtUtc == null
        ) {
            val existingReporting = reportingRepository.findById(reporting.id)
            if (existingReporting.reporting.missionId != null &&
                existingReporting.reporting.detachedFromMissionAtUtc == null &&
                existingReporting.reporting.missionId != reporting.missionId
            ) {
                throw ReportingAlreadyAttachedException(
                    "Reporting ${reporting.id} is already attached to a mission",
                )
            }
        }

        return reportingRepository.save(
            reporting.copy(
                seaFront = seaFront,
            ),
        )
    }
}
