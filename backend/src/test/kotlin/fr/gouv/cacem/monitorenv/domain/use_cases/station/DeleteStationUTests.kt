package fr.gouv.cacem.monitorenv.domain.use_cases.station

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class DeleteStationUTests {
    @Mock
    private val stationRepository: IStationRepository = mock()

    @Mock
    private val canDeleteStation: CanDeleteStation = mock()

    @Test
    fun `execute should delete when canDeleteStation returns true`(log: CapturedOutput) {
        val stationId = 1

        given(canDeleteStation.execute(stationId)).willReturn(true)

        DeleteStation(stationRepository, canDeleteStation).execute(stationId)

        verify(stationRepository).deleteById(stationId)
        assertThat(log.out).contains("Attempt to DELETE station $stationId")
        assertThat(log.out).contains("Station $stationId deleted")
    }

    @Test
    fun `execute should throw BackendUsageException when canDeleteBase returns false`() {
        val stationId = 1

        given(canDeleteStation.execute(stationId)).willReturn(false)

        assertThatThrownBy {
            DeleteStation(stationRepository, canDeleteStation).execute(stationId)
        }.isInstanceOf(BackendUsageException::class.java)
            .hasMessage("Cannot delete station (ID=1) due to existing relationships.")
    }
}
