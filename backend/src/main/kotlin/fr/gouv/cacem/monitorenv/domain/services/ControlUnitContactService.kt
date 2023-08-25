package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IControlUnitContactService
import org.springframework.stereotype.Service

@Service
class ControlUnitContactService(private val controlUnitContactRepository: IControlUnitContactRepository) :
    IControlUnitContactService {
    override fun getByIds(controlUnitContactIds: List<Int>): List<ControlUnitContactEntity> {
        return controlUnitContactIds.map { controlUnitContactRepository.findById(it) }
    }
}
