package fr.gouv.cacem.monitorenv.domain.use_cases.administration

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import kotlin.random.Random

@ExtendWith(OutputCaptureExtension::class)
class CanArchiveAdministrationUTests {
    @Mock
    private val administrationRepository: IAdministrationRepository = mock()

    @Test
    fun `execute should return true when all control units are archived`(log: CapturedOutput) {
        val administrationId = 1
        val fullAdministration =
            FullAdministrationDTO(
                administration =
                    AdministrationEntity(
                        id = 1,
                        name = "Administration Name",
                        isArchived = false,
                    ),
                controlUnits =
                    listOf(
                        ControlUnitEntity(
                            id = 0,
                            administrationId = 1,
                            areaNote = null,
                            departmentAreaInseeCode = null,
                            isArchived = true,
                            name = "Control Unit Name",
                            termsNote = null,
                        ),
                    ),
            )

        given(administrationRepository.findById(administrationId)).willReturn(fullAdministration)

        val result = CanArchiveAdministration(administrationRepository).execute(administrationId)

        assertThat(result).isTrue
        assertThat(log.out).contains("Can administration $administrationId be archived")
    }

    @Test
    fun `execute should return false when some control units are not archived`() {
        val administrationId = 1
        val fullAdministration =
            FullAdministrationDTO(
                administration =
                    AdministrationEntity(
                        id = 1,
                        name = "Administration Name",
                        isArchived = false,
                    ),
                controlUnits =
                    listOf(
                        ControlUnitEntity(
                            id = 0,
                            administrationId = 1,
                            areaNote = null,
                            departmentAreaInseeCode = null,
                            isArchived = false,
                            name = "Control Unit Name",
                            termsNote = null,
                        ),
                    ),
            )

        given(administrationRepository.findById(administrationId)).willReturn(fullAdministration)

        val result = CanArchiveAdministration(administrationRepository).execute(administrationId)

        assertThat(result).isFalse
    }

    @Test
    fun `execute should throw a BackendUsageException when administration doesnt exist`() {
        // Given
        val administrationId = Random.nextInt()

        given(administrationRepository.findById(administrationId)).willReturn(null)

        // When
        val backendUsageException =
            assertThrows<BackendUsageException> {
                CanArchiveAdministration(administrationRepository).execute(administrationId)
            }

        // Then
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.ENTITY_NOT_FOUND)
        assertThat(backendUsageException.message).isEqualTo("administration $administrationId not found for archiving")
    }
}
