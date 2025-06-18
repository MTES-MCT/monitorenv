package fr.gouv.cacem.monitorenv.domain.validators.reporting

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.validators.Validator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

private const val NB_CHAR_MAX = 3

@Component
class ReportingValidator : Validator<ReportingEntity> {
    private val logger = LoggerFactory.getLogger(ReportingValidator::class.java)

    override fun validate(reporting: ReportingEntity) {
        logger.info("Validating reporting: ${reporting.id}")

        if (reporting.openBy?.length != NB_CHAR_MAX == true) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Le trigramme \"ouvert par\" doit avoir 3 lettres",
            )
        }
        if (reporting.validityTime == 0) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "La validité du signalement doit être supérieur à 0",
            )
        }
        if (reporting.targetType === TargetTypeEnum.OTHER && reporting.description === null) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "La description de la cible est obligatoire",
            )
        }
        validateReportingSources(reporting)
    }

    private fun validateReportingSources(reporting: ReportingEntity) {
        if (reporting.reportingSources.isEmpty()) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Une source du signalement est obligatoire",
            )
        }
        reporting.reportingSources.forEach { source ->
            val errorMessage = "La source du signalement est invalide"
            when (source.sourceType) {
                SourceTypeEnum.SEMAPHORE -> {
                    if (source.semaphoreId === null || source.controlUnitId !== null || source.sourceName !== null) {
                        throw BackendUsageException(
                            code = BackendUsageErrorCode.UNVALID_PROPERTY,
                            data = errorMessage,
                        )
                    }
                }

                SourceTypeEnum.CONTROL_UNIT -> {
                    if (source.semaphoreId !== null || source.controlUnitId === null || source.sourceName !== null) {
                        throw BackendUsageException(
                            code = BackendUsageErrorCode.UNVALID_PROPERTY,
                            data = errorMessage,
                        )
                    }
                }

                SourceTypeEnum.OTHER -> {
                    if (source.semaphoreId !== null || source.controlUnitId !== null || source.sourceName === null) {
                        throw BackendUsageException(
                            code = BackendUsageErrorCode.UNVALID_PROPERTY,
                            data = errorMessage,
                        )
                    }
                }
            }
        }
    }
}
