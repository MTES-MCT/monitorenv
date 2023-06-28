package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity

interface IControlUnitRepository {
    fun findControlUnits(): List<ControlUnitEntity>
    fun findControlUnitById(id: Int): ControlUnitEntity
}
