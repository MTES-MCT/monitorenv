package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import com.nhaarman.mockitokotlin2.verifyNoMoreInteractions
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.UnarchivedChildException
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class ArchiveAdministrationUTests {
    @MockBean
    private lateinit var administrationRepository: IAdministrationRepository

    @MockBean
    private lateinit var canArchiveAdministration: CanArchiveAdministration

    @Test
    fun `execute should archive when canArchive returns true`() {
        val administrationId = 1

        given(canArchiveAdministration.execute(administrationId)).willReturn(true)

        ArchiveAdministration(administrationRepository, canArchiveAdministration).execute(administrationId)

        verify(administrationRepository).archiveById(administrationId)
    }

    @Test
    fun `execute should throw UnarchivedChildException when canArchive() returns false`() {
        val administrationId = 1

        given(canArchiveAdministration.execute(administrationId)).willReturn(false)

        assertThatThrownBy {
            ArchiveAdministration(administrationRepository, canArchiveAdministration).execute(administrationId)
        }
            .isInstanceOf(UnarchivedChildException::class.java)

        verifyNoMoreInteractions(administrationRepository)
    }
}
