package fr.gouv.cacem.monitorenv.domain.validators.mission

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.validators.Validator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

private const val NB_CHAR_MAX = 3

@Component
class MissionWithEnvActionsValidator(
    private val missionValidator: MissionValidator,
    private val envActionValidator: EnvActionValidator,
) : Validator<MissionEntity> {
    private val logger = LoggerFactory.getLogger(MissionWithEnvActionsValidator::class.java)

    override fun validate(mission: MissionEntity) {
        missionValidator.validate(mission)

        validateEnvActions(mission)
    }

    private fun validateEnvActions(mission: MissionEntity) {
        mission.envActions?.forEach { envAction ->
            envActionValidator.validate(envAction)
            if (envAction is EnvActionControlEntity) {
                validateCommonDates(envAction, mission)
            }
            if (envAction is EnvActionSurveillanceEntity) {
                validateCommonDates(envAction, mission)
                validateSurveillanceDates(envAction, mission)
            }
        }
    }

    private fun validateSurveillanceDates(
        surveillance: EnvActionSurveillanceEntity,
        mission: MissionEntity,
    ) {
        if (surveillance.actionEndDateTimeUtc?.isAfter(mission.endDateTimeUtc) == true) {
            logger.info("Validating mission surveillance: ${surveillance.actionEndDateTimeUtc}")
            logger.info("Validating mission: ${mission.endDateTimeUtc}")
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data =
                    "La date de fin de la surveillance doit être antérieure à celle de fin de mission",
            )
        }
        if (surveillance.actionEndDateTimeUtc?.isBefore(mission.startDateTimeUtc) == true) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data =
                    "La date de fin de la surveillance doit être postérieure à celle du début de mission",
            )
        }
    }

    private fun validateCommonDates(
        envAction: EnvActionEntity,
        mission: MissionEntity,
    ) {
        val actionType =
            if (envAction.actionType === ActionTypeEnum.CONTROL) {
                "du contrôle"
            } else {
                "de la surveillance"
            }
        if (envAction.actionStartDateTimeUtc?.isBefore(mission.startDateTimeUtc) == true) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data =
                    "La date de début $actionType doit être postérieure à celle du début de mission",
            )
        }
        if (envAction.actionStartDateTimeUtc?.isAfter(mission.endDateTimeUtc) == true) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data =
                    "La date de début $actionType doit être antérieure à celle de fin de mission",
            )
        }
    }
}
