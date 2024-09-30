package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetControlUnitContactByIdUTests {
    @MockBean
    private lateinit var controlUnitContactRepository: IControlUnitContactRepository

    @Test
    fun `execute should return a control unit contact by its ID`() {
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
    }
}
