package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO

@UseCase
class GetAdministrationById(private val administrationRepository: IAdministrationRepository) {
    fun execute(administrationId: Int): FullAdministrationDTO {
        return administrationRepository.findById(administrationId)
    }
}
