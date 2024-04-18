package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime

val FAKE_MISSION =
    MissionEntity(
        id = 1,
        missionTypes = listOf(),
        controlUnits = listOf(),
        openBy = null,
        completedBy = null,
        observationsCacem = null,
        observationsCnsp = null,
        facade = null,
        geom = null,
        startDateTimeUtc = ZonedDateTime.now(),
        endDateTimeUtc = null,
        envActions = listOf(),
        isDeleted = false,
        isGeometryComputedFromControls = false,
        missionSource = MissionSourceEnum.MONITORENV,
        hasMissionOrder = false,
        isUnderJdp = false,
    )

val FAKE_REPORTING =
    ReportingEntity(
        id = 1,
        reportingId = null,
        sourceType = null,
        semaphoreId = null,
        controlUnitId = null,
        sourceName = null,
        targetType = null,
        vehicleType = null,
        targetDetails = null,
        geom = null,
        seaFront = null,
        description = null,
        reportType = null,
        themeId = null,
        subThemeIds = null,
        actionTaken = null,
        isControlRequired = null,
        hasNoUnitAvailable = null,
        createdAt = ZonedDateTime.now(),
        validityTime = null,
        isArchived = false,
        isDeleted = false,
        openBy = null,
        missionId = null,
        attachedToMissionAtUtc = null,
        detachedFromMissionAtUtc = null,
        attachedEnvActionId = null,
    )

@ExtendWith(SpringExtension::class)
class CanDeleteControlUnitUTests {
    @MockBean private lateinit var missionRepository: IMissionRepository

    @MockBean private lateinit var reportingRepository: IReportingRepository

    @Test
    fun `execute should return TRUE there are neither missions nor reportings attached to this control unit`() {
        val controlUnitId = 1

        given(missionRepository.findByControlUnitId(controlUnitId)).willReturn(listOf())
        given(reportingRepository.findByControlUnitId(controlUnitId)).willReturn(listOf())

        val result =
            CanDeleteControlUnit(missionRepository, reportingRepository).execute(controlUnitId)

        assertThat(result).isTrue()
    }

    @Test
    fun `execute should return FALSE when there are non-deleted missions attached to this control unit`() {
        val controlUnitId = 1

        given(missionRepository.findByControlUnitId(controlUnitId))
            .willReturn(
                listOf(FAKE_MISSION),
            )
        given(reportingRepository.findByControlUnitId(controlUnitId)).willReturn(listOf())

        val result =
            CanDeleteControlUnit(missionRepository, reportingRepository).execute(controlUnitId)

        assertThat(result).isFalse()
    }

    @Test
    fun `execute should return TRUE when there are only deleted missions attached to this control unit`() {
        val controlUnitId = 1

        given(missionRepository.findByControlUnitId(controlUnitId))
            .willReturn(
                listOf(FAKE_MISSION.copy(isDeleted = true)),
            )
        given(reportingRepository.findByControlUnitId(controlUnitId)).willReturn(listOf())

        val result =
            CanDeleteControlUnit(missionRepository, reportingRepository).execute(controlUnitId)

        assertThat(result).isTrue()
    }

    @Test
    fun `execute should return FALSE when there are non-deleted reportings attached to this control unit`() {
        val controlUnitId = 1

        given(missionRepository.findByControlUnitId(controlUnitId)).willReturn(listOf())
        given(reportingRepository.findByControlUnitId(controlUnitId))
            .willReturn(
                listOf(FAKE_REPORTING),
            )

        val result =
            CanDeleteControlUnit(missionRepository, reportingRepository).execute(controlUnitId)

        assertThat(result).isFalse()
    }

    @Test
    fun `execute should return TRUE when there are only deleted reportings attached to this control unit`() {
        val controlUnitId = 1

        given(missionRepository.findByControlUnitId(controlUnitId)).willReturn(listOf())
        given(reportingRepository.findByControlUnitId(controlUnitId))
            .willReturn(
                listOf(FAKE_REPORTING.copy(isDeleted = true)),
            )

        val result =
            CanDeleteControlUnit(missionRepository, reportingRepository).execute(controlUnitId)

        assertThat(result).isTrue()
    }
}
