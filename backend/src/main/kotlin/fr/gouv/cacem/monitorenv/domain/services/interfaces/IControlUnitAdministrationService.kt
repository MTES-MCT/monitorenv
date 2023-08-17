package fr.gouv.cacem.monitorenv.domain.services.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity

interface IControlUnitAdministrationService {
    fun getById(controlUnitAdministrationId: Int): NextControlUnitAdministrationEntity
}
