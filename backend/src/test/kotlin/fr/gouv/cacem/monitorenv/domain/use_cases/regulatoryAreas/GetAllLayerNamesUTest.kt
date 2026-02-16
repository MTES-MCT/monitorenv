package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAllLayerNamesUTest {
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository = mock()
    private val getAllLayerNames = GetAllLayerNames(regulatoryAreaRepository)

    @Test
    fun `execute should return all layer names`(log: CapturedOutput) {
        // Given
        val expectedLayerNames = listOf("Layer1", "Layer2", "Layer3")
        given(regulatoryAreaRepository.findAllLayerNames()).willReturn(expectedLayerNames)

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
        given(regulatoryAreaRepository.findAllLayerNames()).willReturn(emptyList())

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
        val expectedLayerNames = listOf("SingleLayer")
        given(regulatoryAreaRepository.findAllLayerNames()).willReturn(expectedLayerNames)

        // When
        val layerNames = getAllLayerNames.execute()

        // Then
        assertThat(layerNames).hasSize(1)
        assertThat(layerNames).containsExactly("SingleLayer")
        assertThat(log.out).contains("Attempt to GET all regulatory areas layer names")
        assertThat(log.out).contains("Found 1 layer names")
    }
}
