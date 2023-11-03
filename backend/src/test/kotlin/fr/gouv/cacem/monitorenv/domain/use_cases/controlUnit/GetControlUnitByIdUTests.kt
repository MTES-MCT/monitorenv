package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetControlUnitByIdUTests {
    @MockBean
    private lateinit var controlUnitRepository: IControlUnitRepository

    @Test
    fun `execute should return a control unit by its ID`() {
        val controlUnitId = 1
        val fullControlUnit = FullControlUnitDTO(
            administration = AdministrationEntity(
                id = 0,
                name = "Administration Name",
                isArchived = false
            ),
            controlUnit = ControlUnitEntity(
                id = 1,
                administrationId = 0,
                areaNote = null,
                departmentAreaInseeCode = null,
                isArchived = false,
                name = "Control Unit Name",
                termsNote = null
            ),
            departmentArea = null,
            controlUnitContacts = listOf(),
            controlUnitResources = listOf()
        )

        given(controlUnitRepository.findById(controlUnitId)).willReturn(fullControlUnit)

        val result = GetControlUnitById(controlUnitRepository).execute(controlUnitId)

        assertThat(result).isEqualTo(fullControlUnit)
    }
}
