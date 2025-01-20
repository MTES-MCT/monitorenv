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

    override fun validate(vigilanceArea: VigilanceAreaEntity) {
        logger.info("Validating vigilance area: ${vigilanceArea.id}")

        if (!vigilanceArea.isDraft) {
            if (vigilanceArea.createdBy !== null && vigilanceArea.createdBy.length != NB_CHAR_MAX) {
                throw BackendUsageException(
                    BackendUsageErrorCode.UNVALID_PROPERTY,
                    "Le trigramme \"créé par\" doit avoir 3 lettres",
                )
            }
            if (vigilanceArea.themes?.isEmpty() == true) {
                throw BackendUsageException(BackendUsageErrorCode.UNVALID_PROPERTY, "Un thème est obligatoire")
            }
            if (!vigilanceArea.isAtAllTimes) {
                if (vigilanceArea.startDatePeriod === null) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "La date de début est obligatoire",
                    )
                }
                if (vigilanceArea.endDatePeriod === null) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "La date de fin est obligatoire",
                    )
                }
                if (vigilanceArea.frequency === null) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "La fréquence est obligatoire",
                    )
                }
                if (vigilanceArea.frequency !== FrequencyEnum.NONE && vigilanceArea.endingCondition === null) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "La condition de fin est obligatoire",
                    )
                }
                if (vigilanceArea.endingCondition === EndingConditionEnum.END_DATE && vigilanceArea.endingOccurrenceDate === null) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "La date de fin de l'occurence est obligatoire",
                    )
                }
                if (vigilanceArea.endingCondition === EndingConditionEnum.OCCURENCES_NUMBER && (vigilanceArea.endingOccurrencesNumber === null || vigilanceArea.endingOccurrencesNumber == 0)) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "Le nombre d'occurence est obligatoire",
                    )
                }
            }
        }
    }
}
