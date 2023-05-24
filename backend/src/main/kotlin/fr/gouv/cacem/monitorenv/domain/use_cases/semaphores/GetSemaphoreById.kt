package fr.gouv.cacem.monitorenv.domain.use_cases.semaphores

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository

@UseCase
class GetSemaphoreById (private val semaphoreRepository: ISemaphoreRepository) {
    fun execute(id: Int): SemaphoreEntity {
        return semaphoreRepository.findSemaphoreById(id)
    }
}