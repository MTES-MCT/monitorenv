package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetLegacyControlUnitsUTest {
    private val controlUnitRepository: IControlUnitRepository = mock()
    private val getLegacyControlUnits = GetLegacyControlUnits(controlUnitRepository)

    @Test
    fun `execute should return control unit`(log: CapturedOutput) {
        // Given
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
            )

        given(controlUnitRepository.findAll()).willReturn(fullControlUnits)

        // When
        val legacyControlUnits = getLegacyControlUnits.execute()

        // Then
        assertThat(legacyControlUnits.size).isEqualTo(fullControlUnits.size)
        assertThat(legacyControlUnits[0].id).isEqualTo(fullControlUnits[0].controlUnit.id)
        assertThat(legacyControlUnits[0].name).isEqualTo(fullControlUnits[0].controlUnit.name)
        assertThat(legacyControlUnits[0].administration).isEqualTo(fullControlUnits[0].administration.name)
        assertThat(legacyControlUnits[0].isArchived).isEqualTo(fullControlUnits[0].controlUnit.isArchived)
        assertThat(legacyControlUnits[0].resources).isEqualTo(fullControlUnits[0].controlUnitResources)
        assertThat(log.out).contains("Attempt to GET all legacy control units")
        assertThat(log.out).contains("Found ${legacyControlUnits.size} legacy control units")
    }
}
