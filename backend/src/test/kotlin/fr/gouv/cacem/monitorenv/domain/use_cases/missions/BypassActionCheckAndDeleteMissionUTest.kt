package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingDetailsDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime
import java.util.*

@ExtendWith(OutputCaptureExtension::class)
class BypassActionCheckAndDeleteMissionUTest {
    private val getFullMission: GetFullMission = mock()
    private val missionRepository: IMissionRepository = mock()
    private val reportingRepository: IReportingRepository = mock()
    private val bypassActionCheckAndDeleteMission =
        BypassActionCheckAndDeleteMission(getFullMission, missionRepository, reportingRepository)

    @Test
    fun `execute should delete mission and detach env action from reporting`(log: CapturedOutput) {
        // Given
        val missionId = 1
        val attachedReportingIds = listOf(1)
        given(getFullMission.execute(missionId)).willReturn(
            MissionFixture.aMissionDetailsDTO(attachedReportingIds = attachedReportingIds),
        )
        val attachedEnvActionId = UUID.randomUUID()
        val aReportingDetailsDTO = aReportingDetailsDTO(id = 1, attachedEnvActionId = attachedEnvActionId)
        given(reportingRepository.findById(attachedReportingIds[0])).willReturn(aReportingDetailsDTO)
        val detachedFromMissionAtUtc = ZonedDateTime.now()
        val savedReporting =
            aReportingDetailsDTO(
                reporting =
                    aReportingDetailsDTO.reporting.copy(
                        detachedFromMissionAtUtc = detachedFromMissionAtUtc,
                        attachedEnvActionId = null,
                    ),
            )
        given(reportingRepository.save(any())).willReturn(savedReporting)

        // When
        bypassActionCheckAndDeleteMission.execute(missionId)

        // Then
        verify(reportingRepository).detachDanglingEnvActions(missionId, listOf(attachedEnvActionId))
        verify(missionRepository).delete(missionId)
        assertThat(savedReporting.reporting.attachedEnvActionId).isNull()
        assertThat(savedReporting.reporting.detachedFromMissionAtUtc).isEqualTo(detachedFromMissionAtUtc)
        assertThat(log.out).contains("Attempt to DELETE mission $missionId without checking actions")
        assertThat(log.out).contains("Mission $missionId deleted")
    }
}
