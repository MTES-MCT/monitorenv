package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository

@UseCase
class CreateOrUpdateControlUnitResource(private val controlUnitResourceRepository: IControlUnitResourceRepository) {
    fun execute(controlUnitResource: ControlUnitResourceEntity): ControlUnitResourceEntity {
        return controlUnitResourceRepository.save(controlUnitResource)
    }
}
