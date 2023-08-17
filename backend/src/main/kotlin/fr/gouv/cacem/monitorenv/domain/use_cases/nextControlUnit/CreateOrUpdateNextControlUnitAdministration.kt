package fr.gouv.cacem.monitorenv.domain.use_cases.nextControlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitAdministrationRepository

@UseCase
class CreateOrUpdateNextControlUnitAdministration(private val nextControlUnitAdministrationRepository: INextControlUnitAdministrationRepository) {
    fun execute(nextControlUnitAdministrationEntity: NextControlUnitAdministrationEntity): NextControlUnitAdministrationEntity {
        return nextControlUnitAdministrationRepository.save(nextControlUnitAdministrationEntity)
    }
}
