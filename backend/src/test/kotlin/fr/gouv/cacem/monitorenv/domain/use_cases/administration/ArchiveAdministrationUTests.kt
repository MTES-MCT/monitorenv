package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class ArchiveAdministrationUTests {
    @Mock
    private val administrationRepository: IAdministrationRepository = mock()

    @Mock
    private val canArchiveAdministration: CanArchiveAdministration = mock()

    @Test
    fun `execute should archive when canArchive returns true`(log: CapturedOutput) {
        val administrationId = 1

        given(canArchiveAdministration.execute(administrationId)).willReturn(true)

        ArchiveAdministration(administrationRepository, canArchiveAdministration).execute(administrationId)

        verify(administrationRepository).archiveById(administrationId)

        assertThat(log.out).contains("Attempt to ARCHIVE administration $administrationId")
        assertThat(log.out).contains("Administration $administrationId archived")
    }

    @Test
    fun `execute should throw CouldNotArchiveException when canArchive() returns false`() {
        val administrationId = 1

        given(canArchiveAdministration.execute(administrationId)).willReturn(false)

        val exception =
            assertThrows<BackendUsageException> {
                ArchiveAdministration(administrationRepository, canArchiveAdministration).execute(administrationId)
            }

        assertThat(exception.code).isEqualTo(BackendUsageErrorCode.UNARCHIVED_CHILD)
    }
}
