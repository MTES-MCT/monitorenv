package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension
import kotlin.random.Random

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class GetControlUnitContactByIdUTests {
    @Mock
    private val controlUnitContactRepository: IControlUnitContactRepository = mock()

    @Test
    fun `execute should return a control unit contact by its ID`(log: CapturedOutput) {
        val controlUnitContactId = 1
        val fullControlUnitContact =
            FullControlUnitContactDTO(
                controlUnit =
                    ControlUnitEntity(
                        id = 0,
                        administrationId = 0,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Control Unit Name",
                        termsNote = null,
                    ),
                controlUnitContact =
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 0,
                        email = null,
                        name = "Control Unit Contact Name",
                        isEmailSubscriptionContact = false,
                        isSmsSubscriptionContact = false,
                        phone = null,
                    ),
            )

        given(controlUnitContactRepository.findById(controlUnitContactId)).willReturn(fullControlUnitContact)

        val result = GetControlUnitContactById(controlUnitContactRepository).execute(controlUnitContactId)

        assertThat(result).isEqualTo(fullControlUnitContact)
        assertThat(log.out).contains("GET control unit contact $controlUnitContactId")
    }

    @Test
    fun `execute should throw a BackendUsageException when control unit contact doesnt exist`() {
        // Given
        val controlUnitContactId = Random.nextInt()
        given(controlUnitContactRepository.findById(controlUnitContactId)).willReturn(null)

        // When
        val backendUsageException =
            assertThrows<BackendUsageException> {
                GetControlUnitContactById(controlUnitContactRepository).execute(controlUnitContactId)
            }

        // Then
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.ENTITY_NOT_FOUND)
        assertThat(backendUsageException.message).isEqualTo("control unit contact $controlUnitContactId not found")
    }
}
