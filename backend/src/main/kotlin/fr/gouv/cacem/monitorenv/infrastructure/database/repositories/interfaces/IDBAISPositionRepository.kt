package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AISPositionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.AISPositionPK
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.ZonedDateTime

interface IDBAISPositionRepository : JpaRepository<AISPositionModel, AISPositionPK> {
    @Query(
        "SELECT position FROM AISPositionModel position WHERE position.pk.mmsi = :mmsi AND position.pk.ts BETWEEN :from AND :to ORDER BY position.pk.ts DESC LIMIT 15",
    )
    fun findAllByMmsiBetweenDates(
        mmsi: Int,
        from: ZonedDateTime,
        to: ZonedDateTime,
    ): List<AISPositionModel>
}
