package fr.gouv.cacem.monitorenv.config

import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.StringDeserializer
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.autoconfigure.kafka.KafkaProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.ConsumerFactory
import org.springframework.kafka.core.DefaultKafkaConsumerFactory

@EnableKafka
@Configuration
@ConditionalOnProperty(value = ["monitorenv.kafka.ais.enabled"], havingValue = "true")
class KafkaAISConsumerConfig(
    val kafkaProperties: KafkaProperties,
) {
    @Bean
    fun consumerFactory(): ConsumerFactory<String?, String?> {
        val props: MutableMap<String?, Any?> = HashMap()
        props.put(
            ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
            kafkaProperties.bootstrapServers,
        )
        props.put(
            ConsumerConfig.GROUP_ID_CONFIG,
            kafkaProperties.consumer.groupId,
        )
        props.put(
            ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
            StringDeserializer::class.java,
        )
        props.put(
            ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
            StringDeserializer::class.java,
        )
        return DefaultKafkaConsumerFactory<String?, String?>(props)
    }

    @Bean
    fun kafkaListenerContainerFactory(): ConcurrentKafkaListenerContainerFactory<String?, String?> {
        val factory =
            ConcurrentKafkaListenerContainerFactory<String?, String?>()
        factory.consumerFactory = consumerFactory()
        return factory
    }
}
