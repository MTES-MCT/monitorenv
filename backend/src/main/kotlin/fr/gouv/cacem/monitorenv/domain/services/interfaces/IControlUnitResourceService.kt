package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity

interface IControlUnitResourceService {
    fun getByIds(controlUnitResourceIds: List<Int>): List<ControlUnitResourceEntity>
}
