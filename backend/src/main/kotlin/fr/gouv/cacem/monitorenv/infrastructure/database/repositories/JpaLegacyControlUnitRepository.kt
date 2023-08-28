package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ILegacyControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBLegacyControlUnitRepository
import org.springframework.stereotype.Repository

@Repository
class JpaLegacyControlUnitRepository(
    private val dbLegacyControlUnitRepository: IDBLegacyControlUnitRepository
) : ILegacyControlUnitRepository {
    override fun findAll(): List<LegacyControlUnitEntity> {
        return dbLegacyControlUnitRepository.findAll().map { it.toLegacyControlUnit() }
    }

    override fun findById(id: Int): LegacyControlUnitEntity {
        return dbLegacyControlUnitRepository.findById(id).get().toLegacyControlUnit()
    }
}
