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
class GetAdministrationByIdUTests {
    @Mock
    private val administrationRepository: IAdministrationRepository = mock()

    @Test
    fun `execute should return an administration by its ID`() {
        val administrationId = 1
        val fullAdministration =
            FullAdministrationDTO(
                administration =
                AdministrationEntity(
                    id = 1,
                    name = "Administration Name",
                    isArchived = false,
                ),
                controlUnits = listOf(),
            )

        given(administrationRepository.findById(administrationId)).willReturn(fullAdministration)

        val result = GetAdministrationById(administrationRepository).execute(administrationId)

        assertThat(result).isEqualTo(fullAdministration)
    }
}
