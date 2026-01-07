package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "monitorenv.kafka.ais")
class KafkaAISProperties(
    var topic: String = "monitorenv.ais.position",
    var timeout: Long = 30000L,
    var batchSize: Int = 100,
)
