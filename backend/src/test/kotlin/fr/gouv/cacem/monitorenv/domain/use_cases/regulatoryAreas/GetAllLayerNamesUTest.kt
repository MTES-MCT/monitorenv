package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaGroupRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupWithTotalDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture.Companion.aRegulatoryArea
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAllLayerNamesUTest {
    private val regulatoryAreaGroupRepository: IRegulatoryAreaGroupRepository = mock()
    private val getAllLayerNames = GetAllLayerNames(regulatoryAreaGroupRepository)

    @Test
    fun `execute should return all layer names`(log: CapturedOutput) {
        // Given
        val expectedLayerNames =
            listOf(
                RegulatoryAreaGroupWithTotalDTO(group = aRegulatoryArea(layerName = "Layer1"), total = 2),
                RegulatoryAreaGroupWithTotalDTO(group = aRegulatoryArea(layerName = "Layer2"), total = 3),
                RegulatoryAreaGroupWithTotalDTO(group = aRegulatoryArea(layerName = "Layer3"), total = 4),
            )

        given(regulatoryAreaGroupRepository.findAllLayerNames()).willReturn(expectedLayerNames)

        // When
        val layerNames = getAllLayerNames.execute()

        // Then
        assertThat(layerNames).isEqualTo(expectedLayerNames)
        assertThat(log.out).contains("Attempt to GET all regulatory areas layer names")
        assertThat(log.out).contains("Found 3 layer names")
    }

    @Test
    fun `execute should return empty list when no layer names exist`(log: CapturedOutput) {
        // Given
        given(regulatoryAreaGroupRepository.findAllLayerNames()).willReturn(emptyList())

        // When
        val layerNames = getAllLayerNames.execute()

        // Then
        assertThat(layerNames).isEmpty()
        assertThat(log.out).contains("Attempt to GET all regulatory areas layer names")
        assertThat(log.out).contains("Found 0 layer names")
    }

    @Test
    fun `execute should return single layer name`(log: CapturedOutput) {
        // Given
        val expectedLayerNames =
            listOf(
                RegulatoryAreaGroupWithTotalDTO(group = aRegulatoryArea(layerName = "SingleLayer"), total = 1),
            )
        given(regulatoryAreaGroupRepository.findAllLayerNames()).willReturn(expectedLayerNames)

        // When
        val layerNames = getAllLayerNames.execute()

        // Then
        assertThat(layerNames).hasSize(1)
        assertThat(layerNames).isEqualTo(expectedLayerNames)
        assertThat(log.out).contains("Attempt to GET all regulatory areas layer names")
        assertThat(log.out).contains("Found 1 layer names")
    }
}
