package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity

interface IControlUnitContactRepository {
    fun findById(controlUnitContactId: Int): ControlUnitContactEntity

    fun findAll(): List<ControlUnitContactEntity>

    fun save(controlUnitContact: ControlUnitContactEntity): ControlUnitContactEntity
}
