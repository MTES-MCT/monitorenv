package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException

@UseCase
class DeleteControlUnit(
    private val controlUnitRepository: IControlUnitRepository,
    private val canDeleteControlUnit: CanDeleteControlUnit,
) {
    fun execute(controlUnitId: Int) {
        if (!canDeleteControlUnit.execute(controlUnitId)) {
            throw ForeignKeyConstraintException(
                "Cannot delete control unit  (ID=$controlUnitId) due to existing relationships.",
            )
        }

        return controlUnitRepository.deleteById(controlUnitId)
    }
}
