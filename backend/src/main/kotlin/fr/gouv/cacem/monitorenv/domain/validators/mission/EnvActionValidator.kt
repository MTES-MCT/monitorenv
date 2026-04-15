package fr.gouv.cacem.monitorenv.domain.validators.mission

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.validators.Validator
import org.springframework.stereotype.Component

private const val NB_CHAR_MAX = 3

@Component
class EnvActionValidator : Validator<EnvActionEntity> {
    override fun validate(envAction: EnvActionEntity) {
        validateEnvAction(envAction)
    }

    private fun validateEnvAction(envAction: EnvActionEntity) {
        if (envAction is EnvActionControlEntity) {
            validateCommonProperties(envAction)
            validateInfractions(envAction)
        }
        if (envAction is EnvActionSurveillanceEntity) {
            validateCommonProperties(envAction)
            validateSurveillance(envAction)
        }
    }
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

private fun validateSurveillance(surveillance: EnvActionSurveillanceEntity) {
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
}

private fun validateCommonProperties(envAction: EnvActionEntity) {
    if (envAction.openBy?.length != NB_CHAR_MAX) {
        throw BackendUsageException(
            code = BackendUsageErrorCode.UNVALID_PROPERTY,
            data = "Le trigramme \"ouvert par\" doit avoir 3 lettres",
        )
    }
}
