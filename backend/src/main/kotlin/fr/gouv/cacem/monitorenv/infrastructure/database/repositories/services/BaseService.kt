package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.services

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.BaseModel
import org.springframework.stereotype.Service

@Service
class BaseService(private val baseRepository: IBaseRepository) {
    fun getBaseModelFromControlUnitResource(controlUnitResource: ControlUnitResourceEntity): BaseModel {
        val base = baseRepository.findById(controlUnitResource.baseId)

        return BaseModel.fromFullBase(base)
    }
}
