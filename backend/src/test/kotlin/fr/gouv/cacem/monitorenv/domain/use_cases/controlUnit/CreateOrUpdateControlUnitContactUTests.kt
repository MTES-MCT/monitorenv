package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.BDDMockito
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateControlUnitContactUTests {
    @MockBean
    private lateinit var controlUnitContactRepository: IControlUnitContactRepository

    @Test
    fun `execute should return the expected result`() {
        // Given
        val newControlUnitContact = ControlUnitContactEntity(
            controlUnitId = 2,
            email = "bob@example.org",
            isEmailSubscriptionContact = false,
            isSmsSubscriptionContact = false,
            name = "Contact Name",
            phone = "0033123456789",
        )

        val repositoryOutputMock = newControlUnitContact.copy(id = 0)
        given(controlUnitContactRepository.save(newControlUnitContact)).willReturn(repositoryOutputMock)

        // When
        val result = CreateOrUpdateControlUnitContact(controlUnitContactRepository).execute(newControlUnitContact)

        // Then
        assertThat(result).isEqualTo(repositoryOutputMock)

        BDDMockito.verify(controlUnitContactRepository).save(newControlUnitContact)
    }
}
