package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository

@UseCase
class CreateOrUpdateControlUnit(private val controlUnitRepository: IControlUnitRepository) {
    fun execute(controlUnit: ControlUnitEntity): ControlUnitEntity {
        return controlUnitRepository.save(controlUnit)
    }
}
