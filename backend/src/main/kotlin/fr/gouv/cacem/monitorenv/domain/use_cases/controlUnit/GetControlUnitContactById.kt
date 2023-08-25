package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository

@UseCase
class GetControlUnitContactById(private val controlUnitContactRepository: IControlUnitContactRepository) {
    fun execute(controlUnitContactId: Int): ControlUnitContactEntity {
        return controlUnitContactRepository.findById(controlUnitContactId)
    }
}
