package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitContactEntity

interface IControlUnitContactService {
    fun getByIds(controlUnitContactIds: List<Int>): List<NextControlUnitContactEntity>
}
