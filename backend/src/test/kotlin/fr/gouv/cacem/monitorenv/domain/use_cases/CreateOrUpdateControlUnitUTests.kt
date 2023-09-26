package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnit
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateControlUnitUTests {
    @MockBean
    private lateinit var controlUnitRepository: IControlUnitRepository

    @Test
    fun `execute() should return save() result`() {
        val newControlUnit = ControlUnitEntity(
            administrationId = 2,
            areaNote = null,
            isArchived = false,
            name = "Control Unit Name",
            termsNote = null,
        )

        val expectatedControlUnit = newControlUnit.copy(id = 0)

        given(controlUnitRepository.save(newControlUnit)).willReturn(expectatedControlUnit)

        val result =
            CreateOrUpdateControlUnit(controlUnitRepository).execute(
                newControlUnit
            )

        verify(controlUnitRepository, times(1)).save(newControlUnit)
        assertThat(result).isEqualTo(expectatedControlUnit)
    }
}
