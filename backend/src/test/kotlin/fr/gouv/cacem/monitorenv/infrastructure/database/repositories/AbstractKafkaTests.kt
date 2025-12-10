package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.MonitorEnvApplication
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.kafka.config.KafkaListenerEndpointRegistry
import org.springframework.kafka.test.utils.ContainerTestUtils
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.wait.strategy.Wait
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.kafka.ConfluentKafkaContainer

@SpringBootTest(
    classes = [MonitorEnvApplication::class],
    properties = ["monitorenv.scheduling.enabled=false"],
)
@Testcontainers
abstract class AbstractKafkaTests : AbstractDBTests() {
    @Autowired
    lateinit var registry: KafkaListenerEndpointRegistry

    @BeforeEach
    fun setUp() {
        registry.listenerContainers.forEach { container ->
            ContainerTestUtils.waitForAssignment(
                container,
                container.containerProperties.topics?.size ?: 1,
            )
        }
    }

    companion object {
        @JvmStatic
        @Container
        val kafka =
            ConfluentKafkaContainer("confluentinc/cp-kafka:8.1.0").apply {
                withExposedPorts(9092)
                waitingFor(
                    Wait.forLogMessage(".*Kafka Server started.*\\s", 2),
                )
                start()
            }

        @JvmStatic
        @DynamicPropertySource
        fun props(reg: DynamicPropertyRegistry) {
            reg.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers)
            reg.add("monitorenv.kafka.ais.enabled", { true })
            reg.add("monitorenv.kafka.ais.producer.enabled", { true })
        }
    }
}
