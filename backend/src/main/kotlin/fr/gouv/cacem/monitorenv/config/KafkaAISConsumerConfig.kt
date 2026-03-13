package fr.gouv.cacem.monitorenv.config

import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import org.apache.kafka.common.serialization.StringDeserializer
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.kafka.autoconfigure.KafkaProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.ConsumerFactory
import org.springframework.kafka.core.DefaultKafkaConsumerFactory
import org.springframework.kafka.support.serializer.JacksonJsonDeserializer

@EnableKafka
@Configuration
@ConditionalOnProperty(value = ["monitorenv.kafka.ais.enabled"], havingValue = "true")
class KafkaAISConsumerConfig(
    val kafkaProperties: KafkaProperties,
) {
    @Bean
    fun consumerFactory(): ConsumerFactory<String, AISPayload> =
        DefaultKafkaConsumerFactory(
            kafkaProperties.buildConsumerProperties(),
            StringDeserializer(),
            JacksonJsonDeserializer<AISPayload>().apply { addTrustedPackages("*") },
        )

    @Bean
    fun kafkaListenerContainerFactory(): ConcurrentKafkaListenerContainerFactory<String, AISPayload> {
        val factory =
            ConcurrentKafkaListenerContainerFactory<String, AISPayload>()
        factory.setConsumerFactory(consumerFactory())
        return factory
    }
}
