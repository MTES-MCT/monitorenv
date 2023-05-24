package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBSemaphoreRepository
import org.springframework.stereotype.Repository

@Repository
class JpaSemaphoreRepository(private val dbSemaphoreRepository: IDBSemaphoreRepository) : ISemaphoreRepository {
    override fun findAllSemaphores(): List<SemaphoreEntity> {
        return dbSemaphoreRepository.findAll().map { it.toSemaphore() }
    }

    override fun findSemaphoreById(id: Int): SemaphoreEntity {
        return dbSemaphoreRepository.findById(id).get().toSemaphore()
    }

    override fun count(): Long {
        return dbSemaphoreRepository.count()
    }
}
