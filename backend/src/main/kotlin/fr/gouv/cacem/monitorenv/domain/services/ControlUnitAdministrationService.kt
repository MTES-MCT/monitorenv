package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IControlUnitAdministrationService
import org.springframework.stereotype.Service

@Service
class ControlUnitAdministrationService(private val nextControlUnitAdministrationRepository: INextControlUnitAdministrationRepository) :
    IControlUnitAdministrationService {
    override fun getById(controlUnitAdministrationId: Int): NextControlUnitAdministrationEntity {
        return nextControlUnitAdministrationRepository.findById(controlUnitAdministrationId)
    }
}
