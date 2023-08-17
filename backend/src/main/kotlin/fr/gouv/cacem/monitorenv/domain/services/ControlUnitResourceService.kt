package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IControlUnitResourceService
import org.springframework.stereotype.Service

@Service
class ControlUnitResourceService(private val nextControlUnitResourceRepository: INextControlUnitResourceRepository) :
    IControlUnitResourceService {
    override fun getByIds(controlUnitResourceIds: List<Int>): List<NextControlUnitResourceEntity> {
        return controlUnitResourceIds.map { nextControlUnitResourceRepository.findById(it) }
    }
}
