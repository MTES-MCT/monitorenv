package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
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
class DeleteControlUnitContactUTests {
    @Mock
    private val controlUnitContactRepository: IControlUnitContactRepository = mock()

    @Test
    fun `execute should delete control unit contact by its ID`(log: CapturedOutput) {
        val controlUnitContactId = 1

        DeleteControlUnitContact(controlUnitContactRepository).execute(controlUnitContactId)

        verify(controlUnitContactRepository).deleteById(controlUnitContactId)
        assertThat(log.out).contains("Attempt to DELETE control unit contact $controlUnitContactId")
        assertThat(log.out).contains("Control unit contact $controlUnitContactId deleted")
    }
}
