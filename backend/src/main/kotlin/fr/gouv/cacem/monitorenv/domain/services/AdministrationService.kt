package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IAdministrationService
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import org.springframework.stereotype.Service

@Service
class AdministrationService(private val administrationRepository: IAdministrationRepository) :
    IAdministrationService {
    override fun getById(administrationId: Int): FullAdministrationDTO {
        return administrationRepository.findById(administrationId)
    }
}
