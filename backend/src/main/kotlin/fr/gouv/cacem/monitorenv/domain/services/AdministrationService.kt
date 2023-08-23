package fr.gouv.cacem.monitorenv.domain.services

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.services.interfaces.IAdministrationService
import org.springframework.stereotype.Service

@Service
class AdministrationService(private val administrationRepository: IAdministrationRepository) :
    IAdministrationService {
    override fun getById(administrationId: Int): AdministrationEntity {
        return administrationRepository.findById(administrationId)
    }
}
