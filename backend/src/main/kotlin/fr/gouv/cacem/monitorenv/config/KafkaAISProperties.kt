package fr.gouv.cacem.monitorenv.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "monitorenv.kafka.ais")
class KafkaAISProperties(
    var topic: String = "monitorenv.ais.position",
)
