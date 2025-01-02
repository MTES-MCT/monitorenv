package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class ArchiveControlUnitResourceUTests {
    @Mock
    private val controlUnitResourceRepository: IControlUnitResourceRepository = mock()

    @Test
    fun `execute should archive a control unit resource by its ID`(log: CapturedOutput) {
        val controlUnitResourceId = 1

        ArchiveControlUnitResource(controlUnitResourceRepository).execute(controlUnitResourceId)

        verify(controlUnitResourceRepository).archiveById(controlUnitResourceId)
        assertThat(log.out).contains("Attempt to ARCHIVE control unit resource $controlUnitResourceId")
        assertThat(log.out).contains("Control unit resource $controlUnitResourceId archived")
    }
}
