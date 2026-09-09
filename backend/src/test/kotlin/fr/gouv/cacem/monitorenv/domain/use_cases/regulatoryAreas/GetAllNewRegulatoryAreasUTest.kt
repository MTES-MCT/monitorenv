package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAllRegulatoryAreasUTest {
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository = mock()
    private val getAllRegulatoryAreas = GetAllRegulatoryAreas(regulatoryAreaGroupRepository)

    @Test
    fun `execute should return all regulatory areas`(log: CapturedOutput) {
        // Given
        val expectedRegulatoryAreaGroup =
            RegulatoryAreaGroupDTO(
                group = RegulatoryAreaFixture.aRegulatoryArea(areaType = AreaTypeEnum.GROUP, layerName = "Layername 1"),
                areas = listOf(RegulatoryAreaFixture.aRegulatoryArea(layerName = "Layername 1")),
            )
        given(
            regulatoryAreaGroupRepository.findAll(
                controlPlan = null,
                seaFronts = null,
                tags = null,
                themes = null,
            ),
        ).willReturn(listOf(expectedRegulatoryAreaGroup))

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
        assertThat(regulatoryAreas).isEqualTo(listOf(expectedRegulatoryAreaGroup))
        assertThat(totalCount).isEqualTo(1)
        assertThat(log.out).contains("Attempt to GET all regulatory areas")
        assertThat(log.out).contains("Found $totalCount regulatory areas across ${regulatoryAreas.size} layers")
    }

    @Test
    fun `execute should group regulatory areas by layer name and location`(log: CapturedOutput) {
        // Given
        val regulatoryAreasGroup1 =
            listOf(
                RegulatoryAreaFixture.aRegulatoryArea(
                    id = 1,
                    layerName = "Layer1",
                    plan = "PSCEM",
                    location = "Location1",
                ),
                RegulatoryAreaFixture.aRegulatoryArea(
                    id = 3,
                    layerName = "Layer1",
                    plan = "PIRC",
                    location = "Location1",
                ),
            )
        val regulatoryAreasGroup2 =
            listOf(
                RegulatoryAreaFixture.aRegulatoryArea(
                    id = 2,
                    layerName = "Layer2",
                    plan = "PIRC",
                    location = "Location2",
                ),
            )
        given(
            regulatoryAreaGroupRepository.findAll(
                controlPlan = null,
                seaFronts = null,
                tags = null,
                themes = null,
            ),
        ).willReturn(
            listOf(
                RegulatoryAreaGroupDTO(
                    group =
                        RegulatoryAreaFixture.aRegulatoryArea(
                            id = 4,
                            areaType = AreaTypeEnum.GROUP,
                            layerName = "Layer1",
                            plan = "PSCEM",
                            location = "Location1",
                        ),
                    areas = regulatoryAreasGroup1,
                ),
                RegulatoryAreaGroupDTO(
                    group =
                        RegulatoryAreaFixture.aRegulatoryArea(
                            id = 5,
                            areaType = AreaTypeEnum.GROUP,
                            layerName = "Layer2",
                            plan = "PIRC",
                            location = "Location2",
                        ),
                    areas = regulatoryAreasGroup2,
                ),
            ),
        )

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
        assertThat(
            groupedRegulatoryAreas
                .filter { it.group.layerName == "Layer1" && it.group.location == "Location1" }
                .flatMap { it.areas },
        ).hasSize(2)
        assertThat(
            groupedRegulatoryAreas
                .filter { it.group.layerName == "Layer2" && it.group.location == "Location2" }
                .flatMap { it.areas },
        ).hasSize(1)

        assertThat(totalCount).isEqualTo(3)

        assertThat(log.out).contains("Attempt to GET all regulatory areas")
        assertThat(log.out).contains("Found 3 regulatory areas across 2 layers")
    }
}
