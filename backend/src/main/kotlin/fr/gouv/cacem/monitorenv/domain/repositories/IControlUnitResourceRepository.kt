package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity

interface IControlUnitResourceRepository {
    fun findById(controlUnitResourceId: Int): ControlUnitResourceEntity

    fun findAll(): List<ControlUnitResourceEntity>

    fun save(controlUnitResource: ControlUnitResourceEntity): ControlUnitResourceEntity
}
