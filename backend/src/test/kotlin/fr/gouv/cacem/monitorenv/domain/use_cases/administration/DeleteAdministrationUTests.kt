package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class DeleteAdministrationUTests {
    @MockBean
    private lateinit var administrationRepository: IAdministrationRepository

    @MockBean
    private lateinit var canDeleteAdministration: CanDeleteAdministration

    @Test
    fun `execute should delete when canDeleteAdministration returns true`() {
        val administrationId = 1

        given(canDeleteAdministration.execute(administrationId)).willReturn(true)

        DeleteAdministration(administrationRepository, canDeleteAdministration).execute(administrationId)

        verify(administrationRepository).deleteById(administrationId)
    }

    @Test
    fun `execute should throw ForeignKeyConstraintException when canDeleteAdministration returns false`() {
        val administrationId = 1

        given(canDeleteAdministration.execute(administrationId)).willReturn(false)

        assertThatThrownBy {
            DeleteAdministration(administrationRepository, canDeleteAdministration).execute(administrationId)
        }
            .isInstanceOf(ForeignKeyConstraintException::class.java)
    }
}
