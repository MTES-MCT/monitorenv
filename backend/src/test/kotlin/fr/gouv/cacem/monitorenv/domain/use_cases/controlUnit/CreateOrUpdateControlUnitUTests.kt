package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class CreateOrUpdateControlUnitUTests {
    @Mock
    private val controlUnitRepository: IControlUnitRepository = mock()

    @Test
    fun `execute should return save() result`(log: CapturedOutput) {
        val newControlUnit =
            ControlUnitEntity(
                administrationId = 2,
                areaNote = null,
                departmentAreaInseeCode = null,
                isArchived = false,
                name = "Control Unit Name",
                termsNote = null,
            )

        val expectatedControlUnit = newControlUnit.copy(id = 0)

        given(controlUnitRepository.save(newControlUnit)).willReturn(expectatedControlUnit)

        val result =
            CreateOrUpdateControlUnit(controlUnitRepository).execute(
                newControlUnit,
            )

        verify(controlUnitRepository, times(1)).save(newControlUnit)
        assertThat(result).isEqualTo(expectatedControlUnit)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE control unit ${newControlUnit.id}")
        assertThat(log.out).contains("Control unit ${result.id} created or updated")
    }
}
