package fr.gouv.cacem.monitorenv.domain.use_cases.semaphores

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import org.slf4j.LoggerFactory

@UseCase
class GetSemaphoreById(private val semaphoreRepository: ISemaphoreRepository) {
    private val logger = LoggerFactory.getLogger(GetAllSemaphores::class.java)

    fun execute(id: Int): SemaphoreEntity {
        logger.info("GET semaphore $id")
        return semaphoreRepository.findById(id)
    }
}
