package fr.gouv.cacem.monitorenv.config

import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import org.apache.kafka.common.serialization.StringDeserializer
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.kafka.autoconfigure.KafkaProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.ConsumerFactory
import org.springframework.kafka.core.DefaultKafkaConsumerFactory
import org.springframework.kafka.listener.ConsumerRecordRecoverer
import org.springframework.kafka.listener.DefaultErrorHandler
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
import org.springframework.kafka.support.serializer.JacksonJsonDeserializer
import org.springframework.util.backoff.FixedBackOff

@EnableKafka
@Configuration
@ConditionalOnProperty(value = ["monitorenv.kafka.ais.enabled"], havingValue = "true")
class KafkaAISConsumerConfig(
    val kafkaProperties: KafkaProperties,
) {
    private val logger = LoggerFactory.getLogger(KafkaAISConsumerConfig::class.java)

    @Bean
    fun consumerFactory(): ConsumerFactory<String, AISPayload> =
        DefaultKafkaConsumerFactory(
            kafkaProperties.buildConsumerProperties(),
            ErrorHandlingDeserializer(StringDeserializer()),
            ErrorHandlingDeserializer(
                JacksonJsonDeserializer(AISPayload::class.java).apply { addTrustedPackages("*") },
            ),
        )

    @Bean
    fun errorHandler(): DefaultErrorHandler {
        val recoverer = ConsumerRecordRecoverer { record, exception ->
            logger.error(
                "Failed to deserialize message from topic=${record.topic()} partition=${record.partition()} offset=${record.offset()}: ${exception?.message}",
            )
        }
        return DefaultErrorHandler(recoverer, FixedBackOff(0L, 0L))
    }

    @Bean
    fun kafkaListenerContainerFactory(): ConcurrentKafkaListenerContainerFactory<String, AISPayload> {
        val factory =
            ConcurrentKafkaListenerContainerFactory<String, AISPayload>()
        factory.setConsumerFactory(consumerFactory())
        factory.setCommonErrorHandler(errorHandler())
        return factory
    }
}
