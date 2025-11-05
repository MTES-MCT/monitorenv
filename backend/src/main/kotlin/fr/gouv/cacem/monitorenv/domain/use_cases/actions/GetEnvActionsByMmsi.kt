package fr.gouv.cacem.monitorenv.domain.use_cases.actions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlWithInfractionsEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import org.slf4j.LoggerFactory
import java.util.UUID

@UseCase
class GetEnvActionsByMmsi(
    private val envActionRepository: IEnvActionRepository,
) {
    private val logger = LoggerFactory.getLogger(GetEnvActionsByMmsi::class.java)

    fun execute(
        mmsi: String,
        idToExclude: UUID?,
    ): List<EnvActionControlWithInfractionsEntity> {
        logger.info("Attempt to find envAction with mmsi $mmsi")
        val envActions = envActionRepository.findAllByMmsi(mmsi, idToExclude)
        logger.info("Found ${envActions.size} envActions.")

        return envActions
    }
}
