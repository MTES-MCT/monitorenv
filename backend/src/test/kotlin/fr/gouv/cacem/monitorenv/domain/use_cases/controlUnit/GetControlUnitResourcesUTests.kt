package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitResourceFixture.Companion.aControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.station.fixtures.StationFixture.Companion.aStationEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class GetControlUnitResourcesUTests {
    @Mock
    private val controlUnitResourceRepository: IControlUnitResourceRepository = mock()

    @Test
    fun `execute should return all control unit resources`(log: CapturedOutput) {
        val controlUnitResources =
            listOf(
                FullControlUnitResourceDTO(
                    controlUnit = aControlUnit(),
                    controlUnitResource = aControlUnitResource(),
                    station = aStationEntity(),
                ),
                FullControlUnitResourceDTO(
                    controlUnit = aControlUnit(),
                    controlUnitResource = aControlUnitResource(),
                    station = aStationEntity(),
                ),
            )

        given(controlUnitResourceRepository.findAll()).willReturn(controlUnitResources)

        val result = GetControlUnitResources(controlUnitResourceRepository).execute()

        assertThat(result).isEqualTo(controlUnitResources)
        assertThat(result.size).isEqualTo(2)
        assertThat(log.out).contains("Attempt to GET all control unit resources")
        assertThat(log.out).contains("Found ${result.size} control unit resources")
    }
}
