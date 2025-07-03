package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IPostgisFunctionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.events.UpdateFullMissionEvent
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.events.UpdateReportingEvent
import fr.gouv.cacem.monitorenv.domain.validators.UseCaseValidation
import fr.gouv.cacem.monitorenv.domain.validators.reporting.ReportingValidator
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher

@UseCase
class CreateOrUpdateReporting(
    private val reportingRepository: IReportingRepository,
    private val facadeRepository: IFacadeAreasRepository,
    private val missionRepository: IMissionRepository,
    private val postgisFunctionRepository: IPostgisFunctionRepository,
    private val eventPublisher: ApplicationEventPublisher,
) {
    private val logger: Logger = LoggerFactory.getLogger(CreateOrUpdateReporting::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(
        @UseCaseValidation<ReportingEntity>(validator = ReportingValidator::class)
        reporting: ReportingEntity,
    ): ReportingDetailsDTO {
        logger.info("Attempt to CREATE or UPDATE reporting ${reporting.id}")
        reporting.validate()

        val reportingToSaveIsAttachedToMission =
            reporting.attachedToMissionAtUtc != null &&
                reporting.missionId != null &&
                reporting.detachedFromMissionAtUtc == null

        var existingReporting: ReportingDetailsDTO? = null

        if (reporting.id != null) {
            existingReporting = reportingRepository.findById(reporting.id)

            if (reportingToSaveIsAttachedToMission && existingReporting != null) {
                val existingReportingIsAttachedToAnotherMission =
                    existingReporting.reporting.missionId != null &&
                        existingReporting.reporting.detachedFromMissionAtUtc == null &&
                        existingReporting.reporting.missionId != reporting.missionId

                if (existingReportingIsAttachedToAnotherMission) {
                    val errorMessage = "Reporting ${reporting.id} is already attached to a mission"
                    logger.error(errorMessage)
                    throw BackendUsageException(
                        BackendUsageErrorCode.CHILD_ALREADY_ATTACHED,
                        errorMessage,
                    )
                }
            }
        }

        val normalizedGeometry =
            reporting.geom?.let { nonNullGeometry ->
                postgisFunctionRepository.normalizeGeometry(nonNullGeometry)
            }

        val seaFront =
            normalizedGeometry?.let { nonNullGeometry ->
                facadeRepository.findFacadeFromGeometry(nonNullGeometry)
            }

        val savedReporting =
            reportingRepository.save(
                reporting.copy(
                    geom = normalizedGeometry,
                    seaFront = seaFront,
                ),
            )
        logger.info("Reporting ${savedReporting.reporting.id} created or updated")

        // send mission event if reporting is newly attached to a mission
        if (savedReporting.reporting.attachedToMissionAtUtc != null &&
            savedReporting.reporting.missionId != null &&
            savedReporting.reporting.detachedFromMissionAtUtc == null
        ) {
            val attachedMission = missionRepository.findFullMissionById(savedReporting.reporting.missionId)

            if (attachedMission != null) {
                eventPublisher.publishEvent(
                    UpdateFullMissionEvent(attachedMission),
                )
            }
        }

        if (reporting.id != null) {
            logger.info(
                "Sending CREATE/UPDATE event for reporting id ${savedReporting.reporting.id}.",
            )
            eventPublisher.publishEvent(
                UpdateReportingEvent(savedReporting),
            )
        }

        return savedReporting
    }
}
