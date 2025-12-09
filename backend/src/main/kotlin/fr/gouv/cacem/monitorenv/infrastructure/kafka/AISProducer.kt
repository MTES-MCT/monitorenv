package fr.gouv.cacem.monitorenv.infrastructure.kafka

import fr.gouv.cacem.monitorenv.infrastructure.kafka.AISListener.Companion.TOPIC
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPositionEntity
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.ZonedDateTime
import java.util.*
import kotlin.random.Random

/**
 * ⚠ For dev and testing purpose only ⚠. Do not use it for production.
 */
@Component
@ConditionalOnProperty(
    value = ["monitorenv.kafka.ais.enabled", "monitorenv.kafka.ais.producer.enabled"],
    havingValue = "true",
)
class AISProducer(
    private val kafkaTemplate: KafkaTemplate<String, AISPayload>,
) {
    private val logger = LoggerFactory.getLogger(AISProducer::class.java)

    companion object {
        fun generateRandomPoint(): String {
            val longitude: Double = Random.nextDouble() * 360 - 180 // -180 à 180
            val latitude: Double = Random.nextDouble() * 180 - 90 // -90 à 90
            return "POINT($longitude $latitude)"
        }
    }

    @Scheduled(fixedRate = 15000)
    fun sendMessage() {
        try {
            logger.info("Sending AIS positions...")
            kafkaTemplate.send(
                TOPIC,
                AISPayload(
                    positions =
                        listOf(
                            AISPositionEntity(
                                id = null,
                                mmsi = Random.nextInt(0, 999999999),
                                coord = generateRandomPoint(),
                                status = UUID.randomUUID().toString(),
                                course = Random.nextDouble(),
                                heading = Random.nextDouble(),
                                speed = Random.nextDouble(),
                                ts = ZonedDateTime.now(),
                            ),
                        ),
                ),
            )
        } catch (ex: Exception) {
            logger.error(ex.message)
            throw ex
        }
    }
}
