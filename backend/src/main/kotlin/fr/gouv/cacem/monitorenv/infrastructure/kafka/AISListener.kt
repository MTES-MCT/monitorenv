package fr.gouv.cacem.monitorenv.infrastructure.kafka

import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
class AISListener {
    val messages = mutableListOf<String>()

    @KafkaListener(topics = ["ais"])
    fun listenAIS(message: String) {
        messages.add(message)
    }
}
