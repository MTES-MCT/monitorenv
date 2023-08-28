package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO

interface IControlUnitContactService {
    fun getByIds(controlUnitContactIds: List<Int>): List<FullControlUnitContactDTO>
}
