package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateAdministrationUTests {
    @Mock
    private val administrationRepository: IAdministrationRepository = mock()

    @Test
    fun `execute should return save result`() {
        val newAdministration =
            AdministrationEntity(
                isArchived = false,
                name = "Administration Name",
            )

        val expectedAdministration = newAdministration.copy(id = 0)

        given(administrationRepository.save(newAdministration)).willReturn(expectedAdministration)

        val result = CreateOrUpdateAdministration(administrationRepository).execute(newAdministration)

        verify(administrationRepository, times(1)).save(newAdministration)
        assertThat(result).isEqualTo(expectedAdministration)
    }
}
