package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.exceptions.CouldNotDeleteException
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class DeleteAdministrationUTests {
    @Mock
    private val administrationRepository: IAdministrationRepository = mock()

    @Mock
    private val canDeleteAdministration: CanDeleteAdministration = mock()

    @Test
    fun `execute should delete when canDeleteAdministration returns true`() {
        val administrationId = 1

        given(canDeleteAdministration.execute(administrationId)).willReturn(true)

        DeleteAdministration(administrationRepository, canDeleteAdministration).execute(administrationId)

        verify(administrationRepository).deleteById(administrationId)
    }

    @Test
    fun `execute should throw CouldNotDeleteException when canDeleteAdministration returns false`() {
        val administrationId = 1

        given(canDeleteAdministration.execute(administrationId)).willReturn(false)

        assertThatThrownBy {
            DeleteAdministration(administrationRepository, canDeleteAdministration).execute(administrationId)
        }
            .isInstanceOf(CouldNotDeleteException::class.java)
    }
}
