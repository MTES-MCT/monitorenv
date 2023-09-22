package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository

@UseCase
class CreateOrUpdateControlUnitContact(private val controlUnitContactRepository: IControlUnitContactRepository) {
    fun execute(controlUnitContact: ControlUnitContactEntity): ControlUnitContactEntity {
        return controlUnitContactRepository.save(controlUnitContact)
    }
}
