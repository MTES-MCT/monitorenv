package fr.gouv.cacem.monitorenv.domain.use_cases.amps

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAMPById(
    private val ampRepository: IAMPRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAMPById::class.java)

    fun execute(id: Int): AMPEntity {
        ampRepository.findById(id)?.let { return it }
        val errorMessage = "amp $id not found"
        logger.error(errorMessage)
        throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, errorMessage)
    }
}
