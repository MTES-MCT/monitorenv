package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity

interface IControlUnitService {
    fun getById(controlUnitId: Int): NextControlUnitEntity
    fun getByIds(controlUnitIds: List<Int>): List<NextControlUnitEntity>
}
