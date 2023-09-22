package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

@UseCase
class GetControlUnitById(private val controlUnitRepository: IControlUnitRepository) {
    fun execute(controlUnitId: Int): FullControlUnitDTO {
        return controlUnitRepository.findById(controlUnitId)
    }
}
