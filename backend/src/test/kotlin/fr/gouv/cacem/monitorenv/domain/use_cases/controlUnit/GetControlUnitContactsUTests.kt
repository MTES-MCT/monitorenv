package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitContactFixture.Companion.aControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aControlUnit
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
class GetControlUnitContactsUTests {
    @Mock
    private val controlUnitContactRepository: IControlUnitContactRepository = mock()

    @Test
    fun `execute should return all control unit contacts`(log: CapturedOutput) {
        val controlUnitContacts =
            listOf(
                FullControlUnitContactDTO(
                    controlUnit = aControlUnit(),
                    controlUnitContact = aControlUnitContact(),
                ),
                FullControlUnitContactDTO(
                    controlUnit = aControlUnit(),
                    controlUnitContact = aControlUnitContact(),
                ),
            )

        given(controlUnitContactRepository.findAll()).willReturn(controlUnitContacts)

        val result = GetControlUnitContacts(controlUnitContactRepository).execute()

        assertThat(result).isEqualTo(controlUnitContacts)
        assertThat(result.size).isEqualTo(2)
        assertThat(log.out).contains("Attempt to GET all control unit contacts")
        assertThat(log.out).contains("Found ${result.size} control unit contacts")
    }
}
