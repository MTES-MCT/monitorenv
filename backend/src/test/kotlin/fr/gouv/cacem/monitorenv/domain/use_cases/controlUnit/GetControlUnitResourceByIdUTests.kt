package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
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
                controlUnit =
                    ControlUnitEntity(
                        id = 0,
                        administrationId = 0,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Control Unit Name",
                        termsNote = null,
                    ),
                controlUnitResource =
                    ControlUnitResourceEntity(
                        id = 1,
                        controlUnitId = 0,
                        isArchived = false,
                        name = "Control Unit Resource Name",
                        note = null,
                        photo = null,
                        stationId = 0,
                        type = ControlUnitResourceType.BARGE,
                    ),
                station =
                    StationEntity(
                        id = 0,
                        latitude = 0.0,
                        longitude = 0.0,
                        name = "Station Name",
                    ),
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
