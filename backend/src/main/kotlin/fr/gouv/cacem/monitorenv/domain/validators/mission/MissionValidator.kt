package fr.gouv.cacem.monitorenv.domain.validators.mission

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.validators.Validator
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

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
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "La date de fin doit être postérieure à la date de début",
            )
        }
        if (mission.missionTypes.isEmpty()) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Le type de mission est requis",
            )
        }

        if (mission.controlUnits.isEmpty()) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Une unité de contrôle est requise",
            )
        }

        if (mission.completedBy !== null && mission.completedBy.length != NB_CHAR_MAX) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Le trigramme \"complété par\" doit avoir 3 lettres",
            )
        }
        if (mission.openBy !== null && mission.openBy.length != NB_CHAR_MAX) {
            throw BackendUsageException(
                code = BackendUsageErrorCode.UNVALID_PROPERTY,
                data = "Le trigramme \"ouvert par\" doit avoir 3 lettres",
            )
        }
    }
}
