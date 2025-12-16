package fr.gouv.cacem.monitorenv.infrastructure.kafka

import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.AbstractKafkaTests
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAISPositionRepository
import fr.gouv.cacem.monitorenv.infrastructure.kafka.AISListener.Companion.TOPIC
import fr.gouv.cacem.monitorenv.infrastructure.kafka.adapters.AISPayload
import jakarta.transaction.Transactional
import org.assertj.core.api.Assertions.assertThat
import org.awaitility.Awaitility
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.kafka.core.KafkaTemplate
import java.time.ZonedDateTime
import java.util.concurrent.TimeUnit

class AISListenerITests : AbstractKafkaTests() {
    @Autowired
    lateinit var kafkaTemplate: KafkaTemplate<String, AISPayload>

    @Autowired
    lateinit var dbAISPositionRepository: IDBAISPositionRepository

    @Transactional
    @Test
    fun `listenAIS should save AISPosition that comes from AIS topic`() {
        // Given
        val coord = "POINT(-2.7335 47.6078)"
        val aisPosition =
            AISPayload(
                id = null,
                mmsi = 1234567890,
                coord = coord,
                status = "status",
                course = 12.12,
                heading = 10.12,
                speed = 10.12,
                ts = ZonedDateTime.parse("2025-01-01T00:00:00.00Z"),
            )

        kafkaTemplate.send(TOPIC, aisPosition).get(10, TimeUnit.SECONDS)

        Awaitility
            .await()
            .pollInterval(1, TimeUnit.SECONDS)
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted {
                val saved = dbAISPositionRepository.findByIdOrNull(1)
                assertThat(saved).isNotNull()
                assertThat(saved?.mmsi).isEqualTo(aisPosition.mmsi)
                assertThat(saved?.coord).isEqualTo(WKTReader().read(coord) as Point)
                assertThat(saved?.status).isEqualTo(aisPosition.status)
                assertThat(saved?.course).isEqualTo(aisPosition.course)
                assertThat(saved?.heading).isEqualTo(aisPosition.heading)
                assertThat(saved?.speed).isEqualTo(aisPosition.speed)
                assertThat(saved?.ts).isEqualTo(aisPosition.ts)
            }
    }
}
