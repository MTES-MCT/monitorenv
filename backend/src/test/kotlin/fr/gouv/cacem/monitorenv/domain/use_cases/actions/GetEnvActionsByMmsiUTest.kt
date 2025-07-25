package fr.gouv.cacem.monitorenv.domain.use_cases.actions

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.util.UUID

@ExtendWith(OutputCaptureExtension::class)
class GetEnvActionsByMmsiUTest {
    private val envActionRepository: IEnvActionRepository = mock()

    val getEnvActionByMmsi: GetEnvActionsByMmsi = GetEnvActionsByMmsi(envActionRepository)

    private val objectMapper: ObjectMapper = ObjectMapper()

    @Test
    fun `execute should return envAction with given MMSI`(log: CapturedOutput) {
        // Given
        val mmsi = "0123456789"
        given(envActionRepository.findAllByMmsi(mmsi)).willReturn(listOf(anEnvAction(objectMapper, UUID.randomUUID())))

        // When
        val envActions = getEnvActionByMmsi.execute(mmsi)

        // Then
        assertThat(envActions).hasSize(1)
        assertThat(log.out).contains("Attempt to find envAction with mmsi $mmsi")
        assertThat(log.out).contains("Found ${envActions.size} envActions.")
    }
}
