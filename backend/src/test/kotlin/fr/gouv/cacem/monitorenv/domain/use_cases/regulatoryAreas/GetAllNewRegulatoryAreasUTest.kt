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
class GetAllNewRegulatoryAreasUTest {
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository = mock()
    private val getAllRegulatoryAreas = GetAllNewRegulatoryAreas(regulatoryAreaRepository)

    @Test
    fun `execute should return all regulatory areas`(log: CapturedOutput) {
        // Given
        val expectedRegulatoryAreas = listOf(RegulatoryAreaNewFixture.aNewRegulatoryArea())
        given(regulatoryAreaRepository.findAll()).willReturn(expectedRegulatoryAreas)

        // When
        val regulatoryAreas =
            getAllRegulatoryAreas.execute(
                groupBy = null,
                searchQuery = null,
                seaFronts = null,
            )

        // Then
        assertThat(expectedRegulatoryAreas).isEqualTo(regulatoryAreas)
        assertThat(log.out).contains("Attempt to GET all regulatory areas")
        assertThat(log.out).contains("Found ${regulatoryAreas.size} regulatory areas")
    }
}
