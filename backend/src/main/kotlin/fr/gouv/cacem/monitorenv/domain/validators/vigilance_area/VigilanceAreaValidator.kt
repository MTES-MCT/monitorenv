package fr.gouv.cacem.monitorenv.domain.validators.vigilance_area

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.validators.Validator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

private const val NB_CHAR_MAX = 3

@Component
class VigilanceAreaValidator : Validator<VigilanceAreaEntity> {
    private val logger = LoggerFactory.getLogger(VigilanceAreaValidator::class.java)

    override fun validate(obj: VigilanceAreaEntity) {
        logger.info("Validating vigilance area: ${obj.id}")

        if (!obj.isDraft) {
            validatePublishedVigilanceArea(obj)
        }
    }

    private fun validatePublishedVigilanceArea(vigilanceArea: VigilanceAreaEntity) {
        if (vigilanceArea.geom === null) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "La géométrie est obligatoire",
            )
        }
        if (vigilanceArea.comments === null) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Un commentaire est obligatoire",
            )
        }
        if (vigilanceArea.createdBy !== null && vigilanceArea.createdBy.length != NB_CHAR_MAX) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Le trigramme \"créé par\" doit avoir 3 lettres",
            )
        }
        if (vigilanceArea.tags.isEmpty() && vigilanceArea.themes.isEmpty()) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Un tag ou un thème est obligatoire",
            )
        }
        vigilanceArea.periods.forEach { period ->
            if (!period.isAtAllTimes) {
                if (period.startDatePeriod === null) {
                    throw BackendUsageException(
                        code = BackendUsageErrorCode.UNVALID_PROPERTY,
                        data = "La date de début est obligatoire",
                    )
                }
                if (period.endDatePeriod === null) {
                    throw BackendUsageException(
                        code = BackendUsageErrorCode.UNVALID_PROPERTY,
                        data = "La date de fin est obligatoire",
                    )
                }
                if (period.frequency === null) {
                    throw BackendUsageException(
                        code = BackendUsageErrorCode.UNVALID_PROPERTY,
                        data = "La fréquence est obligatoire",
                    )
                }
                if (period.frequency !== FrequencyEnum.NONE && period.endingCondition === null) {
                    throw BackendUsageException(
                        code = BackendUsageErrorCode.UNVALID_PROPERTY,
                        data = "La condition de fin est obligatoire",
                    )
                }
                if (period.endingCondition === EndingConditionEnum.END_DATE &&
                    period.endingOccurrenceDate === null
                ) {
                    throw BackendUsageException(
                        code = BackendUsageErrorCode.UNVALID_PROPERTY,
                        data = "La date de fin de l'occurence est obligatoire",
                    )
                }
                if (period.endingCondition === EndingConditionEnum.OCCURENCES_NUMBER &&
                    (period.endingOccurrencesNumber === null || period.endingOccurrencesNumber == 0)
                ) {
                    throw BackendUsageException(
                        code = BackendUsageErrorCode.UNVALID_PROPERTY,
                        data = "Le nombre d'occurence est obligatoire",
                    )
                }
            }
        }
    }
}
