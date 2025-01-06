package fr.gouv.cacem.monitorenv.domain.use_cases.station

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
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
class CanDeleteStationUTests {
    @Mock
    private val stationRepository: IStationRepository = mock()

    @Test
    fun `execute should return true when control unit resources are empty`() {
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

        val result = CanDeleteStation(stationRepository).execute(stationId)

        assertThat(result).isTrue
    }

    @Test
    fun `execute should return false when control unit resources are not empty`() {
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
                controlUnitResources =
                listOf(
                    ControlUnitResourceEntity(
                        id = 0,
                        stationId = 1,
                        controlUnitId = 0,
                        isArchived = false,
                        name = "Control Unit Resource Name",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE,
                    ),
                ),
            )

        given(stationRepository.findById(stationId)).willReturn(fullStation)

        val result = CanDeleteStation(stationRepository).execute(stationId)

        assertThat(result).isFalse
    }
}
