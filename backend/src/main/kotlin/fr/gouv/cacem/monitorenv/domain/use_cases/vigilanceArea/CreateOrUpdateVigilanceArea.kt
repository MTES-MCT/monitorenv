package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
@UseCase
class CreateOrUpdateVigilanceArea(
    private val vigilanceAreaRepository: IVigilanceAreaRepository,
) {
    @Throws(IllegalArgumentException::class)
    fun execute(vigilanceArea: VigilanceAreaEntity): VigilanceAreaEntity {
        return vigilanceAreaRepository.save(vigilanceArea)
    }
}
