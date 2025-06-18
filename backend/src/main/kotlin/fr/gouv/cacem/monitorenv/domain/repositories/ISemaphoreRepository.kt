package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity

interface ISemaphoreRepository {
    fun findAll(): List<SemaphoreEntity>

    fun findById(id: Int): SemaphoreEntity?

    fun count(): Long
}
