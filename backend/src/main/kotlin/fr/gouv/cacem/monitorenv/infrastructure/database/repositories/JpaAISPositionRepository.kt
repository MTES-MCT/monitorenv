package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.positions.AISPositionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAISPositionRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.AISPositionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAISPositionRepository
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import jakarta.transaction.Transactional
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import java.time.ZonedDateTime

@Repository
class JpaAISPositionRepository(
    private val dbAISPositionRepository: IDBAISPositionRepository,
) : IAISPositionRepository {
    private val logger: Logger = LoggerFactory.getLogger(JpaAISPositionRepository::class.java)

    @Transactional
    fun save(aisPosition: AISPayload) {
        dbAISPositionRepository.save(AISPositionModel.toAISPositionModel(aisPosition))
    }

    @Transactional
    fun saveAll(aisPositions: List<AISPayload>) {
        dbAISPositionRepository.saveAll(aisPositions.map { AISPositionModel.toAISPositionModel(it) })
    }

    @Transactional
    override fun findAllByMmsiBetweenDates(
        mmsi: Int,
        from: ZonedDateTime,
        to: ZonedDateTime,
    ): List<AISPositionEntity> =
        dbAISPositionRepository.findAllByMmsiBetweenDates(mmsi, from, to).map { it.toAISPositionEntity() }
}
