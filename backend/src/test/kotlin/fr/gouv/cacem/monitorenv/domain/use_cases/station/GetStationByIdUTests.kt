package fr.gouv.cacem.monitorenv.domain.use_cases.station

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetStationByIdUTests {
    @Mock
    private val stationRepository: IStationRepository = mock()

    @Test
    fun `execute should return a station by its ID`() {
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
    }
}
