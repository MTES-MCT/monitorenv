package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.positions.AISPositionEntity
import java.time.ZonedDateTime

interface IAISPositionRepository {
    fun findAllByMmsiBetweenDates(
        mmsi: Int,
        from: ZonedDateTime,
        to: ZonedDateTime,
    ): List<AISPositionEntity>
}
