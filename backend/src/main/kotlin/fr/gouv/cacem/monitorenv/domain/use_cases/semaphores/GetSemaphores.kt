package fr.gouv.cacem.monitorenv.domain.use_cases.semaphores

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import org.slf4j.LoggerFactory

@UseCase
class GetSemaphores(private val semaphoreRepository: ISemaphoreRepository) {
    private val logger = LoggerFactory.getLogger(GetSemaphores::class.java)
    fun execute(): List<SemaphoreEntity> {
        val semaphores = semaphoreRepository.findAllSemaphores()
        logger.info("Found ${semaphores.size} semaphores ")
        return semaphores
    }
}
