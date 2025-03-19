package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingSourceRepository
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
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
    fun `execute should delete control unit when canDeleteControlUnit returns true`(log: CapturedOutput) {
        val controlUnitId = 1

        given(canDeleteControlUnit.execute(controlUnitId)).willReturn(true)

        deleteControlUnit.execute(controlUnitId)

        verify(controlUnitRepository).deleteById(controlUnitId)
        assertThat(log.out).contains("Attempt to DELETE control unit $controlUnitId")
        assertThat(log.out).contains("Control unit $controlUnitId deleted")
    }

    @Test
    fun `execute should throw CouldNotDeleteException when canDeleteControlUnit returns false`() {
        val controlUnitId = 1

        given(canDeleteControlUnit.execute(controlUnitId)).willReturn(false)

        assertThatThrownBy {
            deleteControlUnit.execute(controlUnitId)
        }.isInstanceOf(CouldNotDeleteException::class.java)
    }
}
