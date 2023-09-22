package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.CreateOrUpdateAdministration
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateAdministrationUTests {
    @MockBean
    private lateinit var administrationRepository: IAdministrationRepository

    @Test
    fun `execute() should return save() result`() {
        val administration = AdministrationEntity(
            controlUnitIds = listOf(3),
            name = "Administration Name"
        )

        val expectation = administration.copy(id = 3)

        given(administrationRepository.save(administration)).willReturn(expectation)

        val result =
            CreateOrUpdateAdministration(administrationRepository).execute(
                administration
            )

        verify(administrationRepository, times(1)).save(administration)
        assertThat(result).isEqualTo(expectation)
    }
}
