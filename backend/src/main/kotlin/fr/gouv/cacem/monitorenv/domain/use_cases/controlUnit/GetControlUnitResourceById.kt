package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository

@UseCase
class GetControlUnitResourceById(private val controlUnitResourceRepository: IControlUnitResourceRepository) {
    fun execute(controlUnitResourceId: Int): ControlUnitResourceEntity {
        return controlUnitResourceRepository.findById(controlUnitResourceId)
    }
}
