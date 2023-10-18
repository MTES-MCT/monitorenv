package fr.gouv.cacem.monitorenv.domain.use_cases.base

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository

@UseCase
class CanDeleteBase(private val baseRepository: IBaseRepository) {
    fun execute(baseId: Int): Boolean {
        val fullBase = baseRepository.findById(baseId)

        return fullBase.controlUnitResources.isEmpty()
    }
}
