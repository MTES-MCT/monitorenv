package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.ReportingAlreadyAttachedException
import fr.gouv.cacem.monitorenv.domain.repositories.*
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateReporting(
    private val reportingRepository: IReportingRepository,
    private val facadeRepository: IFacadeAreasRepository,
    private val postgisFunctionRepository: IPostgisFunctionRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(CreateOrUpdateReporting::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(reporting: ReportingEntity?): ReportingDTO {
        require(reporting != null) { "No reporting to create or update" }
        logger.info("Create or update reporting: $reporting.id")
        reporting.validate()

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
        val normalizedGeometry = if (reporting.geom != null) {
            postgisFunctionRepository.normalizeGeometry(
                reporting.geom,
            )
        } else {
            null
        }

        val seaFront = if (normalizedGeometry != null) {
            facadeRepository.findFacadeFromGeometry(normalizedGeometry)
        } else {
            null
        }

        return reportingRepository.save(
            reporting.copy(
                geom = normalizedGeometry,
                seaFront = seaFront,
            ),
        )
    }
}
