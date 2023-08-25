package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitRepository

@UseCase
class CreateOrUpdateControlUnit(private val controlUnitRepository: INextControlUnitRepository) {
    fun execute(controlUnit: NextControlUnitEntity): NextControlUnitEntity {
        return controlUnitRepository.save(controlUnit)
    }
}
