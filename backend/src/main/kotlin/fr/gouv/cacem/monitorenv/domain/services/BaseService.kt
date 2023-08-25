package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IBaseService
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO
import org.springframework.stereotype.Service

@Service
class BaseService(private val baseRepository: IBaseRepository) : IBaseService {
    override fun getById(baseId: Int): FullBaseDTO {
        return baseRepository.findById(baseId)
    }
}
