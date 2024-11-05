package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository

@UseCase
class GetTrigrams(private val vigilanceAreaRepository: IVigilanceAreaRepository) {
    fun execute(): List<String> {
        return vigilanceAreaRepository.findAllTrigrams()
    }
}
