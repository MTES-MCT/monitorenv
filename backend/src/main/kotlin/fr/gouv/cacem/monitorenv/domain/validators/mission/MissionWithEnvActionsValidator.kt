package fr.gouv.cacem.monitorenv.domain.validators.mission

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.validators.Validator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

private const val NB_CHAR_MAX = 3

@Component
class MissionWithEnvActionsValidator(private val missionValidator: MissionValidator) : Validator<MissionEntity> {
    private val logger = LoggerFactory.getLogger(MissionWithEnvActionsValidator::class.java)

    override fun validate(mission: MissionEntity) {
        missionValidator.validate(mission)

        validateEnvActions(mission)
    }

    private fun validateEnvActions(mission: MissionEntity) {
        mission.envActions?.forEach { envAction ->
            if (envAction is EnvActionControlEntity) {
                validateControl(envAction, mission)
            }

            if (envAction is EnvActionSurveillanceEntity) {
                validateSurveillance(envAction, mission)
            }
        }
    }

    private fun validateControl(
        control: EnvActionControlEntity,
        mission: MissionEntity,
    ) {
        validateEnvAction(control, mission)

        validateInfractions(control)
    }

    private fun validateInfractions(control: EnvActionControlEntity) {
        val sumOfNbTarget = control.infractions?.sumOf { infraction -> infraction.nbTarget }
        if (sumOfNbTarget != 0 &&
            sumOfNbTarget != null &&
            (
                control.actionNumberOfControls != null &&
                    sumOfNbTarget > control.actionNumberOfControls
            )
        ) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Le nombre de cibles excède le nombre total de contrôles",
            )
        }

        control.infractions?.forEach { infraction ->
            if (infraction.infractionType !== InfractionTypeEnum.WAITING &&
                infraction.natinf?.isEmpty() == true
            ) {
                throw BackendUsageException(
                    code = BackendUsageErrorCode.UNVALID_PROPERTY,
                    data =
                        "Une infraction doit avoir une natinf si le type d'infraction n'est pas \"En attente\"",
                )
            }
            if (infraction.nbTarget < 1) {
                throw BackendUsageException(
                    code = BackendUsageErrorCode.UNVALID_PROPERTY,
                    data = "le nombre minimum de cible est 1",
                )
            }
        }
    }

    private fun validateSurveillance(
        surveillance: EnvActionSurveillanceEntity,
        mission: MissionEntity,
    ) {
        validateEnvAction(surveillance, mission)

        if (surveillance.geom === null) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "La géométrie de la surveillance est obligatoire",
            )
        }
        if (surveillance.completedBy !== null && surveillance.completedBy.length != NB_CHAR_MAX) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Le trigramme \"complété par\" doit avoir 3 lettres",
            )
        }
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

    private fun validateEnvAction(
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
        if (envAction.openBy?.length != NB_CHAR_MAX) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Le trigramme \"ouvert par\" doit avoir 3 lettres",
            )
        }
    }
}
