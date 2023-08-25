package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity

interface ILegacyControlUnitRepository {
    fun findAll(): List<LegacyControlUnitEntity>
    fun findById(id: Int): LegacyControlUnitEntity
}
