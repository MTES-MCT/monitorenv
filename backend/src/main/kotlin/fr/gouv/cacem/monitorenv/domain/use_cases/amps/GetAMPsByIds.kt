package fr.gouv.cacem.monitorenv.domain.use_cases.amps

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository

@UseCase
class GetAMPsByIds(
    private val ampRepository: IAMPRepository,
) {
    fun execute(ids: List<Int>): List<AMPEntity> = ampRepository.findAllByIds(ids)
}
