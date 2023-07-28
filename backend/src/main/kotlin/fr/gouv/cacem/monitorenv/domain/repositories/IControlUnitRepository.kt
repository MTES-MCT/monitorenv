package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity

interface IControlUnitRepository {
    fun findAll(): List<ControlUnitEntity>
    fun findById(id: Int): ControlUnitEntity
}
