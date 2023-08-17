package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IControlUnitService
import org.springframework.stereotype.Service

@Service
class ControlUnitService(private val nextControlUnitRepository: INextControlUnitRepository) :
    IControlUnitService {
    override fun getById(controlUnitId: Int): NextControlUnitEntity {
        return nextControlUnitRepository.findById(controlUnitId)
    }

    override fun getByIds(controlUnitIds: List<Int>): List<NextControlUnitEntity> {
        return controlUnitIds.map { nextControlUnitRepository.findById(it) }
    }
}
