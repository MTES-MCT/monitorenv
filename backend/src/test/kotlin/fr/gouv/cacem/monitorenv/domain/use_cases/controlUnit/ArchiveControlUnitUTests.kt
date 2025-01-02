package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class ArchiveControlUnitUTests {
    @MockBean
    private lateinit var controlUnitRepository: IControlUnitRepository

    @Test
    fun `execute should archive a control unit by its ID`(log: CapturedOutput) {
        val controlUnitId = 1

        ArchiveControlUnit(controlUnitRepository).execute(controlUnitId)

        verify(controlUnitRepository).archiveById(controlUnitId)
        assertThat(log.out).contains("Attempt to ARCHIVE control unit $controlUnitId")
        assertThat(log.out).contains("Control unit $controlUnitId archived")
    }
}
