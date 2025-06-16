package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBSemaphoreRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository

@Repository
class JpaSemaphoreRepository(
    private val dbSemaphoreRepository: IDBSemaphoreRepository,
) : ISemaphoreRepository {
    override fun findAll(): List<SemaphoreEntity> = dbSemaphoreRepository.findAll().map { it.toSemaphore() }

    override fun findById(id: Int): SemaphoreEntity? = dbSemaphoreRepository.findByIdOrNull(id)?.toSemaphore()

    override fun count(): Long = dbSemaphoreRepository.count()
}
