package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity

interface IAdministrationService {
    fun getById(administrationId: Int): AdministrationEntity
}
