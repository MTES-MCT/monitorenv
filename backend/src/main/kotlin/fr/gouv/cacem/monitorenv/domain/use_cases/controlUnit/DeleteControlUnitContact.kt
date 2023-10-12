package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository

@UseCase
class DeleteControlUnitContact(private val controlUnitContactRepository: IControlUnitContactRepository) {
    fun execute(controlUnitContactId: Int) {
        return controlUnitContactRepository.deleteById(controlUnitContactId)
    }
}
