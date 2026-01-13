package fr.gouv.cacem.monitorenv.infrastructure.kafka

import fr.gouv.cacem.monitorenv.config.KafkaAISProperties
import fr.gouv.cacem.monitorenv.infrastructure.database.model.AISPositionPK
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.AbstractKafkaTests
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAISPositionRepository
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

    @Autowired
    lateinit var kafkaAISProperties: KafkaAISProperties

    @Transactional
    @Test
    fun `listenAIS should save AISPosition that comes from AIS topic`() {
        // Given
        val coord = "POINT(-2.7335 47.6078)"
        val mmsi = 1234567890
        val ts = ZonedDateTime.parse("2025-01-01T00:00:00.00Z")
        val aisPosition =
            AISPayload(
                mmsi = mmsi,
                coord = coord,
                status = "status",
                course = 12.12,
                heading = 10.12,
                speed = 10.12,
                ts = ts,
            )

        kafkaTemplate.send(kafkaAISProperties.topic, aisPosition).get(10, TimeUnit.SECONDS)

        Awaitility
            .await()
            .pollInterval(1, TimeUnit.SECONDS)
            .atMost(kafkaAISProperties.timeout, TimeUnit.SECONDS)
            .untilAsserted {
                val saved = dbAISPositionRepository.findByIdOrNull(AISPositionPK(mmsi = mmsi, ts = ts))
                assertThat(saved).isNotNull()
                assertThat(saved?.id?.mmsi).isEqualTo(aisPosition.mmsi)
                assertThat(saved?.id?.ts).isEqualTo(aisPosition.ts)
                assertThat(saved?.coord).isEqualTo(WKTReader().read(coord) as Point)
                assertThat(saved?.status).isEqualTo(aisPosition.status)
                assertThat(saved?.course).isEqualTo(1212)
                assertThat(saved?.heading).isEqualTo(1012)
                assertThat(saved?.speed).isEqualTo(1012)
            }
    }
}
