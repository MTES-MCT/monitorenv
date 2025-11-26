package fr.gouv.cacem.monitorenv.infrastructure.kafka

import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(value = ["monitorenv.kafka.ais.enabled"], havingValue = "true")
class AISListener {
    private val logger = LoggerFactory.getLogger(AISListener::class.java)

    val messages = mutableListOf<String>()

    @KafkaListener(topics = ["ais"])
    fun listenAIS(message: String) {
        messages.add(message)
        logger.info("AIS received message: $message")
    }
}
