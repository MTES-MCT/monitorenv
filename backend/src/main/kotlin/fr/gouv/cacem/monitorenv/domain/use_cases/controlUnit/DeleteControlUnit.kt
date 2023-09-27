package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository

@UseCase
class DeleteControlUnit(private val controlUnitRepository: IControlUnitRepository) {
    fun execute(controlUnitId: Int) {
        return controlUnitRepository.deleteById(controlUnitId)
    }
}
