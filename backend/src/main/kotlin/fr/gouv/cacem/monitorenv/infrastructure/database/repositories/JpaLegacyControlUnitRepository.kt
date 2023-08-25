package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ILegacyControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import org.springframework.stereotype.Repository

@Repository
class JpaLegacyControlUnitRepository(private val dbControlUnitRepository: IDBControlUnitRepository) :
    ILegacyControlUnitRepository {

    override fun findAll(): List<LegacyControlUnitEntity> {
        return dbControlUnitRepository.findAll().map { it.toControlUnit() }
    }

    override fun findById(id: Int): LegacyControlUnitEntity {
        return dbControlUnitRepository.findById(id).get().toControlUnit()
    }
}
