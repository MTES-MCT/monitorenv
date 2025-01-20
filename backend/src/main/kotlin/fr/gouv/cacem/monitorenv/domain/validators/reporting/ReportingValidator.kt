package fr.gouv.cacem.monitorenv.domain.validators.reporting

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
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

        if (reporting.openBy !== null && reporting.openBy.length != NB_CHAR_MAX) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "Le trigramme \"ouvert par\" doit avoir 3 lettres",
            )
        }
        if (reporting.reportingSources.isEmpty()) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "Une source du signalement est obligatoire",
            )
        }
        if (reporting.validityTime == 0) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "La validité du signalement doit être supérieur à 0",
            )
        }
        reporting.reportingSources.forEach { source ->
            when (source.sourceType) {
                SourceTypeEnum.SEMAPHORE -> {
                    if (source.semaphoreId === null || source.controlUnitId !== null || source.sourceName !== null) {
                        throw BackendUsageException(
                            BackendUsageErrorCode.UNVALID_PROPERTY,
                            "La source du signalement est invalide",
                        )
                    }
                }

                SourceTypeEnum.CONTROL_UNIT -> {
                    if (source.semaphoreId !== null || source.controlUnitId === null || source.sourceName !== null) {
                        throw BackendUsageException(
                            BackendUsageErrorCode.UNVALID_PROPERTY,
                            "La source du signalement est invalide",
                        )
                    }
                }

                SourceTypeEnum.OTHER -> {
                    if (source.semaphoreId !== null || source.controlUnitId !== null || source.sourceName === null) {
                        throw BackendUsageException(
                            BackendUsageErrorCode.UNVALID_PROPERTY,
                            "La source du signalement est invalide",
                        )
                    }
                }
            }
        }
    }
}
