package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.missions

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.events.UpdateMissionEvent
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class SSEMissionUTests {
    private lateinit var sseMission: SSEMission
    private lateinit var sseEmitterMock: SseEmitter

    @BeforeEach
    fun setUp() {
        sseEmitterMock = mock(SseEmitter::class.java)
        sseMission =
            SSEMission {
                sseEmitterMock
            }
    }

    @Test
    fun `handleUpdateMissionEvent should handle exception when send() throws`(log: CapturedOutput) {
        // Given
        val updateMissionEvent =
            UpdateMissionEvent(
                mission = MissionFixture.aMissionEntity(),
            )
        whenever(
            sseEmitterMock.send(any<Set<ResponseBodyEmitter.DataWithMediaType>>()),
        ).thenThrow(RuntimeException("Simulated exception"))
        sseMission.registerListener()

        // When
        sseMission.handleUpdateMissionEvent(updateMissionEvent)

        // Then
        assertThat(log.out).contains("Error when sending mission event with id")
        verify(sseEmitterMock).completeWithError(any())
        verify(sseEmitterMock, never()).complete()
    }
}
