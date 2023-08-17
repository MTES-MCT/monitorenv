package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity

interface IControlUnitResourceService {
    fun getByIds(controlUnitResourceIds: List<Int>): List<NextControlUnitResourceEntity>
}
