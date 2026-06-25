package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture
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
        val expectedRegulatoryAreas = RegulatoryAreaFixture.aRegulatoryArea()
        given(
            regulatoryAreaRepository.findAll(
                filters =
                    SearchFilters(
                        controlPlan = null,
                        seaFronts = null,
                        tags = null,
                        themes = null,
                        onlyRecentsAreas = null,
                        query = null,
                    ),
            ),
        ).willReturn(listOf(expectedRegulatoryAreas))

        // When
        val (regulatoryAreas, totalCount) =
            getAllRegulatoryAreas.execute(
                filters =
                    SearchFilters(
                        controlPlan = null,
                        seaFronts = null,
                        tags = null,
                        themes = null,
                        onlyRecentsAreas = null,
                        query = null,
                    ),
            )

        // Then
        assertThat(regulatoryAreas)
            .isEqualTo(mapOf("Layername 1" to listOf(expectedRegulatoryAreas)))
        assertThat(totalCount).isEqualTo(1)
        assertThat(log.out).contains("Attempt to GET all regulatory areas")
        assertThat(log.out).contains("Found $totalCount regulatory areas across ${regulatoryAreas.size} layers")
    }

    @Test
    fun `execute should group regulatory areas by control plan`(log: CapturedOutput) {
        // Given
        val regulatoryAreas =
            listOf(
                RegulatoryAreaFixture.aRegulatoryArea(id = 1, layerName = "Layer1", plan = "PIRC"),
                RegulatoryAreaFixture.aRegulatoryArea(id = 2, layerName = "Layer2", plan = "PIRC"),
                RegulatoryAreaFixture.aRegulatoryArea(id = 3, layerName = "Layer1", plan = "PSCEM"),
            )
        given(
            regulatoryAreaRepository.findAll(
                filters =
                    SearchFilters(
                        controlPlan = null,
                        seaFronts = null,
                        tags = null,
                        themes = null,
                        onlyRecentsAreas = null,
                        query = null,
                    ),
            ),
        ).willReturn(regulatoryAreas)

        // When
        val (groupedRegulatoryAreas, totalCount) =
            getAllRegulatoryAreas.execute(
                filters =
                    SearchFilters(
                        controlPlan = null,
                        seaFronts = null,
                        tags = null,
                        themes = null,
                        onlyRecentsAreas = null,
                        query = null,
                    ),
            )

        // Then
        assertThat(groupedRegulatoryAreas).hasSize(2)
        assertThat(groupedRegulatoryAreas["Layer1"]).hasSize(2)
        assertThat(groupedRegulatoryAreas["Layer2"]).hasSize(1)

        assertThat(totalCount).isEqualTo(3)

        assertThat(log.out).contains("Attempt to GET all regulatory areas")
        assertThat(log.out).contains("Found 3 regulatory areas across 2 layers")
    }
}
