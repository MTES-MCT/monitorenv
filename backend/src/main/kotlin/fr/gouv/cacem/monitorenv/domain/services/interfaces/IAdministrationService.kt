package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO

interface IAdministrationService {
    fun getById(administrationId: Int): FullAdministrationDTO
}
