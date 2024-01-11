package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository

@UseCase
class DeleteControlUnitResource(
    private val canDeleteControlUnitResource: CanDeleteControlUnitResource,
    private val controlUnitResourceRepository: IControlUnitResourceRepository,
) {
    fun execute(controlUnitResourceId: Int) {
        if (!canDeleteControlUnitResource.execute(controlUnitResourceId)) {
            throw CouldNotDeleteException(
                "Cannot delete control unit resource (ID=$controlUnitResourceId) due to existing relationships.",
            )
        }

        return controlUnitResourceRepository.deleteById(controlUnitResourceId)
    }
}
