package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity

interface ISemaphoreRepository {
    fun findAllSemaphores(): List<SemaphoreEntity>
    fun findSemaphoreById(id: Int): SemaphoreEntity
    fun count(): Long
}
