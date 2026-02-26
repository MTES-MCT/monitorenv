package fr.gouv.cacem.monitorenv.domain.use_cases.lastPositions

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.positions.AISPositionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAISPositionRepository
import java.time.ZonedDateTime

@UseCase
class GetPositions(
    private val aisPositionRepository: IAISPositionRepository,
) {
    fun execute(
        mmsi: Int,
        from: ZonedDateTime,
        to: ZonedDateTime,
    ): List<AISPositionEntity> = aisPositionRepository.findAllByMmsiBetweenDates(mmsi, from, to)
}
