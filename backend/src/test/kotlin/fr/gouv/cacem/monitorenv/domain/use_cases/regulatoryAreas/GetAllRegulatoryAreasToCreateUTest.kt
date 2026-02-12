package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaNewFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAllRegulatoryAreasToCreateUTest {
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository = mock()
    private val getAllRegulatoryAreasToCreate = GetAllRegulatoryAreasToCreate(regulatoryAreaRepository)

    @Test
    fun `execute should return all regulatory areas to create`(log: CapturedOutput) {
        // Given
        val expectedRegulatoryAreas =
            listOf(
                RegulatoryAreaNewFixture.aNewRegulatoryArea(id = 1),
                RegulatoryAreaNewFixture.aNewRegulatoryArea(id = 2),
            )
        given(regulatoryAreaRepository.findAllToCreate()).willReturn(expectedRegulatoryAreas)

        // When
        val regulatoryAreas = getAllRegulatoryAreasToCreate.execute()

        // Then
        assertThat(regulatoryAreas).isEqualTo(expectedRegulatoryAreas)
        assertThat(log.out).contains("Attempt to GET all regulatory areas to create")
        assertThat(log.out).contains("Found 2 regulatory areas to create")
    }

    @Test
    fun `execute should return empty list when no regulatory areas to create`(log: CapturedOutput) {
        // Given
        given(regulatoryAreaRepository.findAllToCreate()).willReturn(emptyList())

        // When
        val regulatoryAreas = getAllRegulatoryAreasToCreate.execute()

        // Then
        assertThat(regulatoryAreas).isEmpty()
        assertThat(log.out).contains("Attempt to GET all regulatory areas to create")
        assertThat(log.out).contains("Found 0 regulatory areas to create")
    }

    @Test
    fun `execute should return single regulatory area to create`(log: CapturedOutput) {
        // Given
        val expectedRegulatoryAreas = listOf(RegulatoryAreaNewFixture.aNewRegulatoryArea(id = 1))
        given(regulatoryAreaRepository.findAllToCreate()).willReturn(expectedRegulatoryAreas)

        // When
        val regulatoryAreas = getAllRegulatoryAreasToCreate.execute()

        // Then
        assertThat(regulatoryAreas).hasSize(1)
        assertThat(log.out).contains("Attempt to GET all regulatory areas to create")
        assertThat(log.out).contains("Found 1 regulatory areas to create")
    }

    @Test
    fun `execute should throw exception when repository fails`(log: CapturedOutput) {
        // Given
        val exceptionMessage = "Database connection error"
        given(regulatoryAreaRepository.findAllToCreate()).willThrow(RuntimeException(exceptionMessage))

        // When
        val thrownException =
            org.junit.jupiter.api.assertThrows<RuntimeException> {
                getAllRegulatoryAreasToCreate.execute()
            }

        // Then
        assertThat(thrownException.message).isEqualTo(exceptionMessage)
        assertThat(log.out).contains("Attempt to GET all regulatory areas to create")
    }
}
