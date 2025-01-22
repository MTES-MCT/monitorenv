package fr.gouv.cacem.monitorenv.domain.validators.mission

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.AdministrativeResponseEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.SeizureTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.validators.Validator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.ZonedDateTime

private const val NB_CHAR_MAX = 3

@Component
class MissionValidator : Validator<MissionEntity> {
    private val logger = LoggerFactory.getLogger(MissionValidator::class.java)

    override fun validate(mission: MissionEntity) {
        logger.info("Validating mission: ${mission.id}")

        validateMission(mission)
    }

    private fun validateMission(mission: MissionEntity) {
        if (mission.startDateTimeUtc.isAfter(mission.endDateTimeUtc)) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "La date de fin doit être postérieure à la date de début",
            )
        }
        if (mission.missionTypes.isEmpty()) {
            throw BackendUsageException(BackendUsageErrorCode.UNVALID_PROPERTY, "Le type de mission est requis")
        }

        if (mission.controlUnits.isEmpty()) {
            throw BackendUsageException(BackendUsageErrorCode.UNVALID_PROPERTY, "Une unité de contrôle est requise")
        }

        if (mission.completedBy !== null && mission.completedBy.length != NB_CHAR_MAX) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "Le trigramme \"complété par\" doit avoir 3 lettres",
            )
        }
        if (mission.openBy !== null && mission.openBy.length != NB_CHAR_MAX) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "Le trigramme \"ouvert par\" doit avoir 3 lettres",
            )
        }
        validateEnvActions(mission)
    }

    private fun validateEnvActions(mission: MissionEntity) {
        val isMissionEnded =
            mission.endDateTimeUtc != null && ZonedDateTime.now().isAfter(mission.endDateTimeUtc)

        mission.envActions?.forEach { envAction ->
            if (envAction is EnvActionControlEntity) {
                validateControl(envAction, mission, isMissionEnded)
            }

            if (envAction is EnvActionSurveillanceEntity) {
                validateSurveillance(envAction, mission, isMissionEnded)
            }
        }
    }

    private fun validateControl(
        control: EnvActionControlEntity,
        mission: MissionEntity,
        isMissionEnded: Boolean,
    ) {
        validateEnvAction(control, mission)

        if (isMissionEnded) {
            if (control.geom === null) {
                throw BackendUsageException(
                    BackendUsageErrorCode.UNVALID_PROPERTY,
                    "La géométrie du contrôle est obligatoire",
                )
            }
            if (control.vehicleType === null && control.actionTargetType === ActionTargetTypeEnum.VEHICLE) {
                throw BackendUsageException(
                    BackendUsageErrorCode.UNVALID_PROPERTY,
                    "Le type de véhicule est obligatoire",
                )
            }
            validateControlPlan(control)
        }

        validateInfractions(control, isMissionEnded)
    }

    private fun validateInfractions(
        control: EnvActionControlEntity,
        isMissionEnded: Boolean,
    ) {
        val sumOfNbTarget = control.infractions?.sumOf { infraction -> infraction.nbTarget }
        if (sumOfNbTarget != 0 && sumOfNbTarget != null && (control.actionNumberOfControls != null && sumOfNbTarget > control.actionNumberOfControls)) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "Le nombre de cibles excède le nombre total de contrôles",
            )
        }

        control.infractions?.forEach { infraction ->
            if (infraction.infractionType !== InfractionTypeEnum.WAITING && infraction.natinf?.isEmpty() == true) {
                throw BackendUsageException(
                    BackendUsageErrorCode.UNVALID_PROPERTY,
                    "Une infraction doit avoir une natinf si le type d'infraction n'est pas \"En attente\"",
                )
            }
            if (infraction.nbTarget < 1) {
                throw BackendUsageException(
                    BackendUsageErrorCode.UNVALID_PROPERTY,
                    "le nombre minimum de cible est 1",
                )
            }
            if (isMissionEnded) {
                if (infraction.infractionType === InfractionTypeEnum.WAITING) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "Le type d'infraction ne peut pas être \"en attente\"",
                    )
                }
                if (infraction.seizure === SeizureTypeEnum.PENDING) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "L'appréhension/saisie ne peut pas être \"en attente\"",
                    )
                }
                if (infraction.administrativeResponse === AdministrativeResponseEnum.PENDING) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "La réponse administrative ne peut pas être \"en attente\"",
                    )
                }
                if (infraction.formalNotice === FormalNoticeEnum.PENDING) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "La mise en demeure ne peut pas être \"en attente\"",
                    )
                }
            }
        }
    }

    private fun validateSurveillance(
        surveillance: EnvActionSurveillanceEntity,
        mission: MissionEntity,
        isMissionEnded: Boolean,
    ) {
        validateEnvAction(surveillance, mission)

        if (surveillance.geom === null) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "La géométrie de la surveillance est obligatoire",
            )
        }
        if (surveillance.completedBy !== null && surveillance.completedBy.length != NB_CHAR_MAX) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "Le trigramme \"complété par\" doit avoir 3 lettres",
            )
        }
        if (surveillance.actionEndDateTimeUtc?.isAfter(mission.endDateTimeUtc) == true
        ) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "La date de fin de la surveillance doit être antérieure à celle de fin de mission",
            )
        }
        if (surveillance.actionEndDateTimeUtc?.isBefore(mission.startDateTimeUtc) == true) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "La date de fin de la surveillance doit être postérieure à celle du début de mission",
            )
        }
        if (isMissionEnded) {
            validateControlPlan(surveillance)
        }
    }

    private fun validateEnvAction(
        envAction: EnvActionEntity,
        mission: MissionEntity,
    ) {
        val actionType = if (envAction.actionType === ActionTypeEnum.CONTROL) "du contrôle" else "de la surveillance"
        if (envAction.actionStartDateTimeUtc?.isBefore(mission.startDateTimeUtc) == true) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "La date de début $actionType doit être postérieure à celle du début de mission",
            )
        }
        if (envAction.actionStartDateTimeUtc?.isAfter(mission.endDateTimeUtc) == true) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "La date de début $actionType doit être antérieure à celle de fin de mission",
            )
        }
        if (envAction.openBy?.length != NB_CHAR_MAX) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "Le trigramme \"ouvert par\" doit avoir 3 lettres",
            )
        }
    }

    private fun validateControlPlan(envAction: EnvActionEntity) {
        if (envAction.controlPlans?.isEmpty() == true) {
            throw BackendUsageException(
                BackendUsageErrorCode.UNVALID_PROPERTY,
                "Le plan de contrôle est obligatoire",
            )
        } else {
            envAction.controlPlans?.forEach { controlPlan ->
                if (controlPlan.subThemeIds?.isEmpty() == true) {
                    throw BackendUsageException(
                        BackendUsageErrorCode.UNVALID_PROPERTY,
                        "Le sous-thème du plan de contrôle est obligatoire",
                    )
                }
            }
        }
    }
}
