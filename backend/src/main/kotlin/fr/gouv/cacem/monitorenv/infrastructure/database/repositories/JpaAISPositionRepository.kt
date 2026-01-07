package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AISPositionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAISPositionRepository
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import jakarta.transaction.Transactional
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository

@Repository
class JpaAISPositionRepository(
    private val dbAISPositionRepository: IDBAISPositionRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(JpaAISPositionRepository::class.java)

    @Transactional
    fun save(aisPosition: AISPayload) {
        dbAISPositionRepository.save(AISPositionModel.toAISPositionModel(aisPosition))
    }

    @Transactional
    fun saveAll(aisPositions: List<AISPayload>) {
        dbAISPositionRepository.saveAll(aisPositions.map { AISPositionModel.toAISPositionModel(it) })
    }
}
