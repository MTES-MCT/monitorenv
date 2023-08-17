package fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitRepository

@UseCase
class GetNextControlUnitById(private val nextControlUnitRepository: INextControlUnitRepository) {
    fun execute(nextControlUnitId: Int): NextControlUnitEntity {
        return nextControlUnitRepository.findById(nextControlUnitId)
    }
}
