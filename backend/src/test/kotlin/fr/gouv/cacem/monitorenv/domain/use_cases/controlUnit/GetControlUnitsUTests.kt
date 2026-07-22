package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.fixtures.AdministrationFixture.Companion.anAdministration
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
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
class GetControlUnitsUTests {
    @Mock
    private val controlUnitRepository: IControlUnitRepository = mock()

    @Test
    fun `execute should return all control units`(log: CapturedOutput) {
        val fullControlUnits =
            listOf(
                FullControlUnitDTO(
                    administration = anAdministration(),
                    controlUnit = aControlUnit(),
                    departmentArea = null,
                    controlUnitContacts = listOf(),
                    controlUnitResources = listOf(),
                ),
                FullControlUnitDTO(
                    administration = anAdministration(),
                    controlUnit = aControlUnit(),
                    departmentArea = null,
                    controlUnitContacts = listOf(),
                    controlUnitResources = listOf(),
                ),
            )

        given(controlUnitRepository.findAll()).willReturn(fullControlUnits)

        val result = GetControlUnits(controlUnitRepository).execute()

        assertThat(result).isEqualTo(fullControlUnits)
        assertThat(result.size).isEqualTo(2)
        assertThat(log.out).contains("Attempt to GET all control units")
        assertThat(log.out).contains("Found ${result.size} control units")
    }
}
