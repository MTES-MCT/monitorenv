package fr.gouv.cacem.monitorenv.domain.use_cases.base

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException

@UseCase
class DeleteBase(
    private val baseRepository: IBaseRepository,
    private val canDeleteBase: CanDeleteBase
) {
    fun execute(baseId: Int) {
        if (!canDeleteBase.execute(baseId)) {
            throw ForeignKeyConstraintException(
                "Cannot delete base (ID=$baseId) due to existing relationships."
            )
        }

        baseRepository.deleteById(baseId)
    }
}
