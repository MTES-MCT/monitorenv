package fr.gouv.cacem.monitorenv.domain.use_cases.base

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository

@UseCase
class CreateOrUpdateBase(private val baseRepository: IBaseRepository) {
    fun execute(baseEntity: BaseEntity): BaseEntity {
        return baseRepository.save(baseEntity)
    }
}
