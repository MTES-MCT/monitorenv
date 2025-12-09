package fr.gouv.cacem.monitorenv.infrastructure.kafka

import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaAISPositionRepository
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(value = ["monitorenv.kafka.ais.enabled"], havingValue = "true")
class AISListener(
    private val jpaAISPositionRepository: JpaAISPositionRepository,
) {
    private val logger = LoggerFactory.getLogger(AISListener::class.java)

    companion object {
        const val TOPIC = "ais"
    }

    @KafkaListener(topics = [TOPIC])
    fun listenAIS(payload: AISPayload) {
        try {
            logger.info("${payload.positions.size} AIS positions received")
            jpaAISPositionRepository.saveAll(payload.positions)
        } catch (ex: Exception) {
            logger.error(ex.message)
            throw ex
        }
    }
}
