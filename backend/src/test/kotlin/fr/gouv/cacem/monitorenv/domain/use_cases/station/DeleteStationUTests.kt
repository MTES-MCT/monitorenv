package fr.gouv.cacem.monitorenv.domain.use_cases.station

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IStationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class DeleteStationUTests {
    @MockBean
    private lateinit var stationRepository: IStationRepository

    @MockBean
    private lateinit var canDeleteStation: CanDeleteStation

    @Test
    fun `execute should delete when canDeleteStation returns true`() {
        val stationId = 1

        given(canDeleteStation.execute(stationId)).willReturn(true)

        DeleteStation(stationRepository, canDeleteStation).execute(stationId)

        verify(stationRepository).deleteById(stationId)
    }

    @Test
    fun `execute should throw ForeignKeyConstraintException when canDeleteBase returns false`() {
        val stationId = 1

        given(canDeleteStation.execute(stationId)).willReturn(false)

        assertThatThrownBy {
            DeleteStation(stationRepository, canDeleteStation).execute(stationId)
        }
            .isInstanceOf(ForeignKeyConstraintException::class.java)
    }
}
