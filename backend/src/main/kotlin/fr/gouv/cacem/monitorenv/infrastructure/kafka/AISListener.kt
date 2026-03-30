package fr.gouv.cacem.monitorenv.infrastructure.kafka

import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaAISPositionRepository
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import jakarta.annotation.PreDestroy
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

    @KafkaListener(topics = ["\${monitorenv.kafka.ais.topic:monitorenv.ais.position}"])
    fun listenAIS(payload: List<AISPayload>) {
        try {
            jpaAISPositionRepository.saveAll(payload)
        } catch (ex: Exception) {
            logger.error("Could not save AIS batch", ex)
        }
    }

    @PreDestroy
    fun shutdown() {
        logger.info("Shutting down AISListener batch thread")
    }
}
