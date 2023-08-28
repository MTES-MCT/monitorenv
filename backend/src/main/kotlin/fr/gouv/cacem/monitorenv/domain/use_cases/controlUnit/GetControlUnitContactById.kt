package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO

@UseCase
class GetControlUnitContactById(private val controlUnitContactRepository: IControlUnitContactRepository) {
    fun execute(controlUnitContactId: Int): FullControlUnitContactDTO {
        return controlUnitContactRepository.findById(controlUnitContactId)
    }
}
