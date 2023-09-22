package fr.gouv.cacem.monitorenv.domain.use_cases.base

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO

@UseCase
class GetBaseById(private val baseRepository: IBaseRepository) {
    fun execute(baseId: Int): FullBaseDTO {
        return baseRepository.findById(baseId)
    }
}
