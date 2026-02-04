package fr.gouv.cacem.monitorenv.domain.use_cases.lastPositions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.lastPositions.LastPositionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ILastPositionRepository

@UseCase
class GetLastPositions(
    private val lastPositionRepository: ILastPositionRepository,
) {
    fun execute(shipId: Int): List<LastPositionEntity> = lastPositionRepository.findAll(shipId)
}
