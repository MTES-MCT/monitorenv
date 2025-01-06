package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetAdministrationsUTests {
    @Mock
    private val administrationRepository: IAdministrationRepository = mock()

    @Test
    fun `execute should return all administrations`() {
        val fullAdministrations =
            listOf(
                FullAdministrationDTO(
                    administration =
                        AdministrationEntity(
                            id = 1,
                            name = "Administration Name",
                            isArchived = false,
                        ),
                    controlUnits = listOf(),
                ),
                FullAdministrationDTO(
                    administration =
                        AdministrationEntity(
                            id = 2,
                            name = "Administration Name 2",
                            isArchived = false,
                        ),
                    controlUnits = listOf(),
                ),
            )

        given(administrationRepository.findAll()).willReturn(fullAdministrations)

        val result = GetAdministrations(administrationRepository).execute()

        assertThat(result.size).isEqualTo(2)
        assertThat(result).isEqualTo(fullAdministrations)
    }
}
