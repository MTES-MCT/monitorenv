package fr.gouv.cacem.monitorenv.domain.use_cases.station

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateStationUTests {
    @Mock
    private val stationRepository: IStationRepository = mock()

    @Test
    fun `execute should return save() result`() {
        val newStation =
            StationEntity(
                latitude = 0.0,
                longitude = 0.0,
                name = "Station Name",
            )

        val expectedStation = newStation.copy(id = 0)

        given(stationRepository.save(newStation)).willReturn(expectedStation)

        val result = CreateOrUpdateStation(stationRepository).execute(newStation)

        verify(stationRepository, times(1)).save(newStation)
        assertThat(result).isEqualTo(expectedStation)
    }
}
