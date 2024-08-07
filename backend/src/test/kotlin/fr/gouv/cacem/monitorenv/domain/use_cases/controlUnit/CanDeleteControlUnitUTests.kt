package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReporting
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CanDeleteControlUnitUTests {
    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @MockBean
    private lateinit var reportingRepository: IReportingRepository

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
                listOf(aMissionEntity()),
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
                listOf(aMissionEntity().copy(isDeleted = true)),
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
                listOf(aReporting()),
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
                listOf(aReporting().copy(isDeleted = true)),
            )

        val result =
            CanDeleteControlUnit(missionRepository, reportingRepository).execute(controlUnitId)

        assertThat(result).isTrue()
    }
}
