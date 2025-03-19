package fr.gouv.cacem.monitorenv.domain.use_cases.semaphores

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllSemaphores(
    private val semaphoreRepository: ISemaphoreRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllSemaphores::class.java)

    fun execute(): List<SemaphoreEntity> {
        logger.info("Attempt to GET all semaphores")
        val semaphores = semaphoreRepository.findAll()
        logger.info("Found ${semaphores.size} semaphores")

        return semaphores
    }
}
