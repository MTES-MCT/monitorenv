package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IControlUnitResourceService
import org.springframework.stereotype.Service

@Service
class ControlUnitResourceService(private val controlUnitResourceRepository: IControlUnitResourceRepository) :
    IControlUnitResourceService {
    override fun getByIds(controlUnitResourceIds: List<Int>): List<ControlUnitResourceEntity> {
        return controlUnitResourceIds.map { controlUnitResourceRepository.findById(it) }
    }
}
