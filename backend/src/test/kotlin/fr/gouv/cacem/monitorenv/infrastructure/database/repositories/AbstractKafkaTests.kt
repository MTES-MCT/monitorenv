package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.wait.strategy.Wait
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.kafka.ConfluentKafkaContainer

@Testcontainers
abstract class AbstractKafkaTests : AbstractDBTests() {
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
        }
    }
}
