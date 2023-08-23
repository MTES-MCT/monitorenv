package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IBaseService
import org.springframework.stereotype.Service

@Service
class BaseService(private val baseRepository: IBaseRepository) : IBaseService {
    override fun getById(baseId: Int): BaseEntity {
        return baseRepository.findById(baseId)
    }
}
