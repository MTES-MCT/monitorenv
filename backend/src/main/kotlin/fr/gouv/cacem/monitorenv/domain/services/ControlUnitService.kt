package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IControlUnitService
import org.springframework.stereotype.Service

@Service
class ControlUnitService(private val controlUnitRepository: INextControlUnitRepository) :
    IControlUnitService {
    override fun getById(controlUnitId: Int): NextControlUnitEntity {
        return controlUnitRepository.findById(controlUnitId)
    }

    override fun getByIds(controlUnitIds: List<Int>): List<NextControlUnitEntity> {
        return controlUnitIds.map { controlUnitRepository.findById(it) }
    }
}
