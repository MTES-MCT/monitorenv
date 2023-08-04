package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity

interface ISemaphoreRepository {
    fun findAll(): List<SemaphoreEntity>
    fun findById(id: Int): SemaphoreEntity
    fun count(): Long
}
