package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.*
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
        val controlUnit = ControlUnitEntity(
            administrationId = 2,
            areaNote = null,
            controlUnitContactIds = listOf(),
            controlUnitResourceIds = listOf(),
            isArchived = false,
            name = "Control Unit Name",
            termsNote = null,
        )

        val expectation = controlUnit.copy(id = 1)

        given(controlUnitRepository.save(controlUnit)).willReturn(expectation)

        val result =
            CreateOrUpdateControlUnit(controlUnitRepository).execute(
                controlUnit
            )

        verify(controlUnitRepository, times(1)).save(controlUnit)
        assertThat(result).isEqualTo(expectation)
    }
}
