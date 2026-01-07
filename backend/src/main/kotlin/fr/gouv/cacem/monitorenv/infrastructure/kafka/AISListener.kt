package fr.gouv.cacem.monitorenv.infrastructure.kafka

import fr.gouv.cacem.monitorenv.config.KafkaAISProperties
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.JpaAISPositionRepository
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import jakarta.annotation.PostConstruct
import jakarta.annotation.PreDestroy
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.TimeUnit
import kotlin.concurrent.thread

@Component
@ConditionalOnProperty(value = ["monitorenv.kafka.ais.enabled"], havingValue = "true")
class AISListener(
    private val jpaAISPositionRepository: JpaAISPositionRepository,
    private val kafkaAISProperties: KafkaAISProperties,
) {
    private val logger = LoggerFactory.getLogger(AISListener::class.java)

    private val queue = LinkedBlockingQueue<AISPayload>()

    @KafkaListener(topics = ["\${monitorenv.kafka.ais.topic:monitorenv.ais.position}"])
    fun listenAIS(payload: AISPayload) {
        queue.put(payload)
    }

    @PostConstruct
    fun startBatching() {
        thread(isDaemon = true, name = "ais-batch-thread") {
            val batchAisPayloadToSave = mutableListOf<AISPayload>()

            while (!Thread.currentThread().isInterrupted) {
                try {
                    val first = queue.take()
                    batchAisPayloadToSave.add(first)

                    val deadline = System.currentTimeMillis() + kafkaAISProperties.timeout

                    while (batchAisPayloadToSave.size < kafkaAISProperties.batchSize) {
                        val remainingTime = deadline - System.currentTimeMillis()
                        if (remainingTime <= 0) break

                        val aisPayload = queue.poll(remainingTime, TimeUnit.MILLISECONDS)
                        if (aisPayload != null) {
                            batchAisPayloadToSave.add(aisPayload)
                        }
                    }

                    jpaAISPositionRepository.saveAll(batchAisPayloadToSave)
                } catch (ex: Exception) {
                    logger.error("Could not save AIS batch", ex)
                } finally {
                    batchAisPayloadToSave.clear()
                }
            }
        }
    }

    @PreDestroy
    fun shutdown() {
        logger.info("Shutting down AISListener batch thread")
    }
}
