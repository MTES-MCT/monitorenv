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
        val expectedRegulatoryAreas = RegulatoryAreaNewFixture.aNewRegulatoryArea()
        given(regulatoryAreaRepository.findAll()).willReturn(listOf(expectedRegulatoryAreas))

        // When
        val regulatoryAreas =
            getAllRegulatoryAreas.execute(
                groupBy = null,
                searchQuery = null,
                seaFronts = null,
            )

        // Then
        assertThat(mapOf("Layername 1" to listOf(expectedRegulatoryAreas))).isEqualTo(regulatoryAreas)
        assertThat(log.out).contains("Attempt to GET all regulatory areas")
        assertThat(log.out).contains("Found ${regulatoryAreas.size} regulatory areas")
    }

    @Test
    fun `execute should group regulatory areas by control plan`(log: CapturedOutput) {
        // Given
        val regulatoryAreas =
            listOf(
                RegulatoryAreaNewFixture.aNewRegulatoryArea(id = 1, layerName = "Layer1", plan = "PIRC"),
                RegulatoryAreaNewFixture.aNewRegulatoryArea(id = 2, layerName = "Layer2", plan = "PIRC"),
                RegulatoryAreaNewFixture.aNewRegulatoryArea(id = 3, layerName = "Layer1", plan = "PSCEM"),
            )
        given(regulatoryAreaRepository.findAll(groupBy = "CONTROL_PLAN")).willReturn(regulatoryAreas)

        // When
        val groupedRegulatoryAreas =
            getAllRegulatoryAreas.execute(
                groupBy = "CONTROL_PLAN",
                searchQuery = null,
                seaFronts = null,
            )

        // Then
        assertThat(groupedRegulatoryAreas).hasSize(2)
        assertThat(groupedRegulatoryAreas["Layer1"]).hasSize(2)
        assertThat(groupedRegulatoryAreas["Layer2"]).hasSize(1)
        assertThat(log.out).contains("Attempt to GET all regulatory areas")
        assertThat(log.out).contains("Found ${groupedRegulatoryAreas.size} regulatory areas")
    }
}
