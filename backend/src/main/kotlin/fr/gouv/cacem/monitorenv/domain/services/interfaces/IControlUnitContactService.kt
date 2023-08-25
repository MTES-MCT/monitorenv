package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity

interface IControlUnitContactService {
    fun getByIds(controlUnitContactIds: List<Int>): List<ControlUnitContactEntity>
}
