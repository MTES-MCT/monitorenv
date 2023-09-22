package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO

@UseCase
class GetControlUnitResourceById(private val controlUnitResourceRepository: IControlUnitResourceRepository) {
    fun execute(controlUnitResourceId: Int): FullControlUnitResourceDTO {
        return controlUnitResourceRepository.findById(controlUnitResourceId)
    }
}
