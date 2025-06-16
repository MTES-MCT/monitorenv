package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO

interface IControlUnitContactRepository {
    fun deleteById(controlUnitContactId: Int)

    fun findById(controlUnitContactId: Int): FullControlUnitContactDTO?

    fun findAll(): List<FullControlUnitContactDTO>

    fun save(controlUnitContact: ControlUnitContactEntity): ControlUnitContactEntity
}
