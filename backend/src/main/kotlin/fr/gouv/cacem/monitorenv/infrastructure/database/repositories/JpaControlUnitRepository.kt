package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import org.springframework.stereotype.Repository

@Repository
class JpaControlUnitRepository(private val dbControlUnitRepository: IDBControlUnitRepository) : IControlUnitRepository {

    override fun findAll(): List<ControlUnitEntity> {
        return dbControlUnitRepository.findAll().map { it.toControlUnit() }
    }

    override fun findById(id: Int): ControlUnitEntity {
        return dbControlUnitRepository.findById(id).get().toControlUnit()
    }
}
