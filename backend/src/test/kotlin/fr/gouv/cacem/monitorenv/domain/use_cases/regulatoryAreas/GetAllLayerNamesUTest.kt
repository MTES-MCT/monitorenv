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
        val expectedLayerNames =
            mapOf(
                "Layer1" to 2L,
                "Layer2" to 3L,
                "Layer3" to 4L,
            )

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
        given(regulatoryAreaRepository.findAllLayerNames()).willReturn(emptyMap())

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
            mapOf(
                "SingleLayer" to 1L,
            )
        given(regulatoryAreaRepository.findAllLayerNames()).willReturn(expectedLayerNames)

        // When
        val layerNames = getAllLayerNames.execute()

        // Then
        assertThat(layerNames).hasSize(1)
        assertThat(layerNames).containsExactlyEntriesOf(expectedLayerNames)
        assertThat(log.out).contains("Attempt to GET all regulatory areas layer names")
        assertThat(log.out).contains("Found 1 layer names")
    }
}
