package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository

@UseCase
class GetVigilanceAreas(private val vigilanceAreaRepository: IVigilanceAreaRepository) {
    fun execute(): List<VigilanceAreaEntity> {
        return vigilanceAreaRepository.findAll()
    }
}
