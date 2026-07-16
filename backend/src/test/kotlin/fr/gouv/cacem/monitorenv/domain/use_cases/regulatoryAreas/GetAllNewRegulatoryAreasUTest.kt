package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
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
        val expectedRegulatoryAreas = RegulatoryAreaFixture.aRegulatoryArea(layerName = "Layername 1")
        val expectedRegulatoryAreaGroup =
            RegulatoryAreaFixture.aRegulatoryArea(areaType = AreaTypeEnum.GROUP, layerName = "Layername 1")
        given(
            regulatoryAreaRepository.findAll(
                controlPlan = null,
                seaFronts = null,
                tags = null,
                themes = null,
            ),
        ).willReturn(listOf(expectedRegulatoryAreas, expectedRegulatoryAreaGroup))

        // When
        val (regulatoryAreas, totalCount) =
            getAllRegulatoryAreas.execute(
                controlPlan = null,
                searchQuery = null,
                seaFronts = null,
                tags = null,
                themes = null,
            )

        // Then
        assertThat(regulatoryAreas)
            .isEqualTo(mapOf(expectedRegulatoryAreaGroup to listOf(expectedRegulatoryAreas)))
        assertThat(totalCount).isEqualTo(1)
        assertThat(log.out).contains("Attempt to GET all regulatory areas")
        assertThat(log.out).contains("Found $totalCount regulatory areas across ${regulatoryAreas.size} layers")
    }

    @Test
    fun `execute should group regulatory areas by control plan`(log: CapturedOutput) {
        // Given
        val regulatoryAreas =
            listOf(
                RegulatoryAreaFixture.aRegulatoryArea(
                    id = 1,
                    layerName = "Layer1",
                    plan = "PSCEM",
                ),
                RegulatoryAreaFixture.aRegulatoryArea(
                    id = 2,
                    layerName = "Layer2",
                    plan = "PIRC",
                ),
                RegulatoryAreaFixture.aRegulatoryArea(id = 3, layerName = "Layer1", plan = "PIRC"),
                RegulatoryAreaFixture.aRegulatoryArea(
                    id = 4,
                    areaType = AreaTypeEnum.GROUP,
                    layerName = "Layer1",
                    plan = "PSCEM",
                ),
                RegulatoryAreaFixture.aRegulatoryArea(
                    id = 5,
                    areaType = AreaTypeEnum.GROUP,
                    layerName = "Layer2",
                    plan = "PIRC",
                ),
            )
        given(
            regulatoryAreaRepository.findAll(
                controlPlan = null,
                seaFronts = null,
                tags = null,
                themes = null,
            ),
        ).willReturn(regulatoryAreas)

        // When
        val (groupedRegulatoryAreas, totalCount) =
            getAllRegulatoryAreas.execute(
                controlPlan = null,
                searchQuery = null,
                seaFronts = null,
                tags = null,
                themes = null,
            )

        // Then
        assertThat(groupedRegulatoryAreas).hasSize(2)
        assertThat(groupedRegulatoryAreas.filter { it.key.layerName == "Layer1" }.flatMap { it.value }).hasSize(2)
        assertThat(groupedRegulatoryAreas.filter { it.key.layerName == "Layer2" }.flatMap { it.value }).hasSize(1)

        assertThat(totalCount).isEqualTo(3)

        assertThat(log.out).contains("Attempt to GET all regulatory areas")
        assertThat(log.out).contains("Found 3 regulatory areas across 2 layers")
    }
}
