package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IControlUnitContactService
import org.springframework.stereotype.Service

@Service
class ControlUnitContactService(private val nextControlUnitContactRepository: INextControlUnitContactRepository) :
    IControlUnitContactService {
    override fun getByIds(controlUnitContactIds: List<Int>): List<NextControlUnitContactEntity> {
        return controlUnitContactIds.map { nextControlUnitContactRepository.findById(it) }
    }
}
