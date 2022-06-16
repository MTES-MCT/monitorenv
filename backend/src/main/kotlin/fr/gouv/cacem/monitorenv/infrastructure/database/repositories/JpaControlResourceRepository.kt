package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlResourceRepository

import org.springframework.stereotype.Repository

@Repository
class JpaControlResourceRepository(private val dbControlResourceRepository: IDBControlResourceRepository) :
  IControlResourceRepository {

  override fun findControlResources(): List<ControlResourceEntity> {
    return dbControlResourceRepository.findAll().map { it.toControlResource() }
  }
}
