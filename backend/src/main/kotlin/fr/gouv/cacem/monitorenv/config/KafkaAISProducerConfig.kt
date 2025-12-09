package fr.gouv.cacem.monitorenv.config

import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import org.apache.kafka.common.serialization.StringSerializer
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.autoconfigure.kafka.KafkaProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.core.DefaultKafkaProducerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.core.ProducerFactory
import org.springframework.kafka.support.serializer.JsonSerializer

/**
 * ⚠ For dev and testing purpose only ⚠. Do not use it for production
 */
@Configuration
@ConditionalOnProperty(
    value = ["monitorenv.kafka.ais.enabled", "monitorenv.kafka.ais.producer.enabled"],
    havingValue = "true",
)
class KafkaAISProducerConfig(
    private val kafkaProperties: KafkaProperties,
) {
    @Bean
    fun producerFactory(): ProducerFactory<String, AISPayload> {
        val props = kafkaProperties.buildProducerProperties()

        return DefaultKafkaProducerFactory(
            props,
            { StringSerializer() },
            { JsonSerializer() },
        )
    }

    @Bean
    fun kafkaTemplate(): KafkaTemplate<String, AISPayload> = KafkaTemplate(producerFactory())
}
