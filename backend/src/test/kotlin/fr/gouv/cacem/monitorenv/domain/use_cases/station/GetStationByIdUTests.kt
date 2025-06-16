package fr.gouv.cacem.monitorenv.domain.use_cases.station

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import kotlin.random.Random

@ExtendWith(OutputCaptureExtension::class)
class GetStationByIdUTests {
    @Mock
    private val stationRepository: IStationRepository = mock()

    @Test
    fun `execute should return a station by its ID`(log: CapturedOutput) {
        val stationId = 1
        val fullStation =
            FullStationDTO(
                station =
                    StationEntity(
                        id = 1,
                        latitude = 0.0,
                        longitude = 0.0,
                        name = "Station Name",
                    ),
                controlUnitResources = listOf(),
            )

        given(stationRepository.findById(stationId)).willReturn(fullStation)

        val result = GetStationById(stationRepository).execute(stationId)

        assertThat(result).isEqualTo(fullStation)
        assertThat(log.out).contains("GET station $stationId")
    }

    @Test
    fun `execute should throw a BackendUsageException when mission doesnt exist`() {
        // Given
        val stationId = Random.nextInt()
        given(stationRepository.findById(stationId)).willReturn(null)

        // When
        val backendUsageException =
            assertThrows<BackendUsageException> { GetStationById(stationRepository).execute(stationId) }

        // Then
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.ENTITY_NOT_FOUND)
        assertThat(backendUsageException.message).isEqualTo("station $stationId not found")
    }
}
