package fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitAdministrationRepository

@UseCase
class GetNextControlUnitAdministrationById(private val nextControlUnitAdministrationRepository: INextControlUnitAdministrationRepository) {
    fun execute(nextControlUnitAdministrationId: Int): NextControlUnitAdministrationEntity {
        return nextControlUnitAdministrationRepository.findById(nextControlUnitAdministrationId)
    }
}
