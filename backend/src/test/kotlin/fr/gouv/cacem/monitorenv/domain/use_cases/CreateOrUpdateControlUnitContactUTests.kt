package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitContact
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateControlUnitContactUTests {
    @MockBean
    private lateinit var controlUnitContactRepository: IControlUnitContactRepository

    @Test
    fun `execute() should return save() result`() {
        val controlUnitContact = ControlUnitContactEntity(
            controlUnitId = 2,
            email = null,
            name = "Control Unit Contact Name",
            note = null,
            phone = null,
        )

        val expectation = controlUnitContact.copy(id = 1)

        given(controlUnitContactRepository.save(controlUnitContact)).willReturn(expectation)

        val result =
            CreateOrUpdateControlUnitContact(controlUnitContactRepository).execute(
                controlUnitContact
            )

        verify(controlUnitContactRepository, times(1)).save(controlUnitContact)
        assertThat(result).isEqualTo(expectation)
    }
}
