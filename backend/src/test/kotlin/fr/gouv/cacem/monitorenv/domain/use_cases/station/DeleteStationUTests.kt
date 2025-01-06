package fr.gouv.cacem.monitorenv.domain.use_cases.station

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class DeleteStationUTests {
    @Mock
    private val stationRepository: IStationRepository = mock()

    @Mock
    private val canDeleteStation: CanDeleteStation = mock()

    @Test
    fun `execute should delete when canDeleteStation returns true`() {
        val stationId = 1

        given(canDeleteStation.execute(stationId)).willReturn(true)

        DeleteStation(stationRepository, canDeleteStation).execute(stationId)

        verify(stationRepository).deleteById(stationId)
    }

    @Test
    fun `execute should throw CouldNotDeleteException when canDeleteBase returns false`() {
        val stationId = 1

        given(canDeleteStation.execute(stationId)).willReturn(false)

        assertThatThrownBy {
            DeleteStation(stationRepository, canDeleteStation).execute(stationId)
        }
            .isInstanceOf(CouldNotDeleteException::class.java)
    }
}
