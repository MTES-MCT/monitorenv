package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetControlUnitsUTests {
    @Mock
    private val controlUnitRepository: IControlUnitRepository = mock()

    @Test
    fun `execute should return all control units`() {
        val fullControlUnits =
            listOf(
                FullControlUnitDTO(
                    administration =
                    AdministrationEntity(
                        id = 0,
                        name = "Admin 1",
                        isArchived = false,
                    ),
                    controlUnit =
                    ControlUnitEntity(
                        id = 1,
                        administrationId = 0,
                        areaNote = "Area 1",
                        departmentAreaInseeCode = "A1",
                        isArchived = false,
                        name = "CU 1",
                        termsNote = "Terms 1",
                    ),
                    departmentArea = null,
                    controlUnitContacts = listOf(),
                    controlUnitResources = listOf(),
                ),
                FullControlUnitDTO(
                    administration =
                    AdministrationEntity(
                        id = 1,
                        name = "Admin 2",
                        isArchived = false,
                    ),
                    controlUnit =
                    ControlUnitEntity(
                        id = 2,
                        administrationId = 1,
                        areaNote = "Area 2",
                        departmentAreaInseeCode = "A2",
                        isArchived = false,
                        name = "CU 2",
                        termsNote = "Terms 2",
                    ),
                    departmentArea = null,
                    controlUnitContacts = listOf(),
                    controlUnitResources = listOf(),
                ),
            )

        given(controlUnitRepository.findAll()).willReturn(fullControlUnits)

        val result = GetControlUnits(controlUnitRepository).execute()

        assertThat(result).isEqualTo(fullControlUnits)
        assertThat(result.size).isEqualTo(2)
    }
}
