package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository

@UseCase
class ArchiveControlUnit(private val controlUnitRepository: IControlUnitRepository) {
    fun execute(controlUnitId: Int) {
        return controlUnitRepository.archiveById(controlUnitId)
    }
}
