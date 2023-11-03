package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime

@ExtendWith(SpringExtension::class)
class CanDeleteControlUnitResourceUTests {
    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @Test
    fun `execute should return true when missions are empty`() {
        val controlUnitResourceId = 1

        given(missionRepository.findByControlUnitResourceId(controlUnitResourceId)).willReturn(listOf())

        val result = CanDeleteControlUnitResource(missionRepository).execute(controlUnitResourceId)

        assertThat(result).isTrue
    }

    @Test
    fun `execute should return false when missions are not empty`() {
        val controlUnitResourceId = 1

        given(missionRepository.findByControlUnitResourceId(controlUnitResourceId)).willReturn(
            listOf(
                MissionEntity(
                    id = 1,
                    missionTypes = listOf(),
                    controlUnits = listOf(),
                    openBy = null,
                    closedBy = null,
                    observationsCacem = null,
                    observationsCnsp = null,
                    facade = null,
                    geom = null,
                    startDateTimeUtc = ZonedDateTime.now(),
                    endDateTimeUtc = null,
                    envActions = listOf(),
                    isClosed = false,
                    isDeleted = false,
                    isGeometryComputedFromControls = false,
                    missionSource = MissionSourceEnum.MONITORENV,
                    hasMissionOrder = false,
                    isUnderJdp = false,

                ),
            ),
        )

        val result = CanDeleteControlUnitResource(missionRepository).execute(controlUnitResourceId)

        assertThat(result).isFalse
    }
}
