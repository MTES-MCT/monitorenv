package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingSourceRepository
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock

class DeleteControlUnitUTests {
    private val controlUnitRepository: IControlUnitRepository = mock()

    private val canDeleteControlUnit: CanDeleteControlUnit = mock()

    private val missionRepository: IMissionRepository = mock()

    private val reportingRepository: IReportingRepository = mock()

    private val reportingsSourceRepository: IReportingSourceRepository = mock()

    private val deleteControlUnit: DeleteControlUnit =
        DeleteControlUnit(
            controlUnitRepository,
            canDeleteControlUnit,
            missionRepository,
            reportingRepository,
            reportingsSourceRepository,
        )

    @Test
    fun `execute should delete control unit when canDeleteControlUnit returns true`() {
        val controlUnitId = 1

        given(canDeleteControlUnit.execute(controlUnitId)).willReturn(true)

        deleteControlUnit.execute(controlUnitId)

        verify(controlUnitRepository).deleteById(controlUnitId)
    }

    @Test
    fun `execute should throw CouldNotDeleteException when canDeleteControlUnit returns false`() {
        val controlUnitId = 1

        given(canDeleteControlUnit.execute(controlUnitId)).willReturn(false)

        assertThatThrownBy {
            deleteControlUnit.execute(controlUnitId)
        }
            .isInstanceOf(CouldNotDeleteException::class.java)
    }
}
