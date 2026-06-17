package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitResourceFixture.Companion.aControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.station.fixtures.StationFixture.Companion.aStationEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension
import kotlin.random.Random

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class GetControlUnitResourceByIdUTests {
    @Mock
    private val controlUnitResourceRepository: IControlUnitResourceRepository = mock()

    @Test
    fun `execute should return a control unit resource by its ID`(log: CapturedOutput) {
        val controlUnitResourceId = 1
        val fullControlUnitResource =
            FullControlUnitResourceDTO(
                controlUnit = aControlUnit(),
                controlUnitResource = aControlUnitResource(),
                station = aStationEntity(),
            )

        given(controlUnitResourceRepository.findById(controlUnitResourceId)).willReturn(fullControlUnitResource)

        val result = GetControlUnitResourceById(controlUnitResourceRepository).execute(controlUnitResourceId)

        assertThat(result).isEqualTo(fullControlUnitResource)
        assertThat(log.out).contains("GET control unit resource $controlUnitResourceId")
    }

    @Test
    fun `execute should throw a BackendUsageException when control unit resource doesnt exist`() {
        // Given
        val controlUnitResourceId = Random.nextInt()
        given(controlUnitResourceRepository.findById(controlUnitResourceId)).willReturn(null)

        // When
        val backendUsageException =
            assertThrows<BackendUsageException> {
                GetControlUnitResourceById(controlUnitResourceRepository).execute(controlUnitResourceId)
            }

        // Then
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.ENTITY_NOT_FOUND)
        assertThat(backendUsageException.message).isEqualTo("control unit resource $controlUnitResourceId not found")
    }
}
