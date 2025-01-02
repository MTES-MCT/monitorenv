package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryArea.fixtures.RegulatoryAreaFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAllRegulatoryAreasUTest {
    private val regulatoryAreaRepository: IRegulatoryAreaRepository = mock()
    private val getAllRegulatoryAreas = GetAllRegulatoryAreas(regulatoryAreaRepository)

    @Test
    fun `execute should return all regulatory areas`(log: CapturedOutput) {
        // Given
        val expectedRegulatoryAreas = listOf(RegulatoryAreaFixture.aRegulatoryArea())
        given(regulatoryAreaRepository.findAll()).willReturn(expectedRegulatoryAreas)

        // When
        val regulatoryAreas = getAllRegulatoryAreas.execute()

        // Then
        assertThat(expectedRegulatoryAreas).isEqualTo(regulatoryAreas)
        assertThat(log.out).contains("Attempt to GET all regulatory areas")
        assertThat(log.out).contains("Found ${regulatoryAreas.size} regulatory areas")
    }
}
