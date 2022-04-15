package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBRegulatoryAreaRepository

import org.springframework.stereotype.Repository

@Repository
class JpaRegulatoryAreaRepository(private val dbRegulatoryAreaRepository: IDBRegulatoryAreaRepository) :
  IRegulatoryAreaRepository {

  override fun findRegulatoryAreas(): List<RegulatoryAreaEntity> {
    return dbRegulatoryAreaRepository.findAll().map { it.toRegulatoryArea() }
  }

  override fun findRegulatoryAreaById(id: Int): RegulatoryAreaEntity {
    return dbRegulatoryAreaRepository.findById(id).get().toRegulatoryArea()
  }
}
