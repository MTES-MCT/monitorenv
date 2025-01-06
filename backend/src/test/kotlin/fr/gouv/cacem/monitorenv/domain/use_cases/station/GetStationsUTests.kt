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
class GetStationsUTests {
    @Mock
    private val stationRepository: IStationRepository = mock()

    @Test
    fun `execute should return all stations`() {
        val stations =
            listOf(
                FullStationDTO(
                    station =
                        StationEntity(
                            id = 1,
                            latitude = 0.0,
                            longitude = 0.0,
                            name = "Station Name",
                        ),
                    controlUnitResources = listOf(),
                ),
                FullStationDTO(
                    station =
                        StationEntity(
                            id = 2,
                            latitude = 0.0,
                            longitude = 0.0,
                            name = "Station Name 2",
                        ),
                    controlUnitResources = listOf(),
                ),
            )

        given(stationRepository.findAll()).willReturn(stations)

        val result = GetStations(stationRepository).execute()

        assertThat(result.size).isEqualTo(2)
        assertThat(result).isEqualTo(stations)
    }
}
