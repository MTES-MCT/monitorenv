package fr.gouv.cacem.monitorenv.infrastructure.kafka

import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.AbstractDBTests
import org.assertj.core.api.Assertions.assertThat
import org.awaitility.Awaitility
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.kafka.core.KafkaTemplate
import java.util.concurrent.TimeUnit

class AISListenerITests : AbstractDBTests() {
    @Autowired
    lateinit var kafkaTemplate: KafkaTemplate<String, String>

    @Autowired
    lateinit var aisListener: AISListener

    @Test
    fun `listenAIS should return message that comes from AIS topic`() {
        // Given
        val message = "Hello world"

        // When
        kafkaTemplate.send("ais", message)

        // Then
        Awaitility
            .await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted {
                assertThat(aisListener.messages).contains(message)
            }
    }
}
