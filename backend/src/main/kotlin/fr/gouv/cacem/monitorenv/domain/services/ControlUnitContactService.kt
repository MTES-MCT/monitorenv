package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IControlUnitContactService
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import org.springframework.stereotype.Service

@Service
class ControlUnitContactService(private val controlUnitContactRepository: IControlUnitContactRepository) :
    IControlUnitContactService {
    override fun getByIds(controlUnitContactIds: List<Int>): List<FullControlUnitContactDTO> {
        return controlUnitContactIds.map { controlUnitContactRepository.findById(it) }
    }
}
