package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
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
                    controlUnit =
                        ControlUnitEntity(
                            id = 1,
                            administrationId = 101,
                            areaNote = "Area 1",
                            departmentAreaInseeCode = "A1",
                            isArchived = false,
                            name = "Control Unit 1",
                            termsNote = "Terms 1",
                        ),
                    controlUnitContact =
                        ControlUnitContactEntity(
                            id = 1,
                            controlUnitId = 1,
                            email = "contact1@example.com",
                            isEmailSubscriptionContact = false,
                            isSmsSubscriptionContact = false,
                            name = "Contact 1",
                            phone = "123-456-7890",
                        ),
                ),
                FullControlUnitContactDTO(
                    controlUnit =
                        ControlUnitEntity(
                            id = 2,
                            administrationId = 102,
                            areaNote = "Area 2",
                            departmentAreaInseeCode = "A2",
                            isArchived = false,
                            name = "Control Unit 2",
                            termsNote = "Terms 2",
                        ),
                    controlUnitContact =
                        ControlUnitContactEntity(
                            id = 2,
                            controlUnitId = 2,
                            email = "contact2@example.com",
                            isEmailSubscriptionContact = false,
                            isSmsSubscriptionContact = false,
                            name = "Contact 2",
                            phone = "098-765-4321",
                        ),
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
