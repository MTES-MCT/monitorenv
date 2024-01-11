package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository

@UseCase
class DeleteControlUnit(
    private val controlUnitRepository: IControlUnitRepository,
    private val canDeleteControlUnit: CanDeleteControlUnit,
) {
    fun execute(controlUnitId: Int) {
        if (!canDeleteControlUnit.execute(controlUnitId)) {
            throw CouldNotDeleteException(
                "Cannot delete control unit  (ID=$controlUnitId) due to existing relationships.",
            )
        }

        return controlUnitRepository.deleteById(controlUnitId)
    }
}
