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
        const val TOPIC = "monitorenv.ais.position"
    }

    @KafkaListener(topics = [TOPIC])
    fun listenAIS(payload: AISPayload) {
        try {
            jpaAISPositionRepository.save(payload)
        } catch (ex: Exception) {
            logger.error("Could not save ais position:  ${ex.message}")
            throw ex
        }
    }
}
