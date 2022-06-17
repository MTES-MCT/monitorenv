package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.infractions.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IInfractionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBInfractionRepository

import org.springframework.stereotype.Repository

@Repository
class JpaInfractionRepository(private val dbInfractionRepository: IDBInfractionRepository) :
  IInfractionRepository {
  override fun findInfractions(): List<InfractionEntity> {
    return dbInfractionRepository.findAll().map { it.toInfraction() }
  }
}
