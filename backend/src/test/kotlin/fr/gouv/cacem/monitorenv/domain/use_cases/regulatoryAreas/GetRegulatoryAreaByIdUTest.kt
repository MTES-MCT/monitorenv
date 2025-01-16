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
class GetRegulatoryAreaByIdUTest {
    private val regulatoryAreaRepository: IRegulatoryAreaRepository = mock()
    private val getRegulatoryAreaById = GetRegulatoryAreaById(regulatoryAreaRepository)

    @Test
    fun `execute should return regulatory area by its id`(log: CapturedOutput) {
        // Given
        val id = 1
        val expectedRegulatoryArea = RegulatoryAreaFixture.aRegulatoryArea()
        given(regulatoryAreaRepository.findById(id)).willReturn(expectedRegulatoryArea)

        // When
        val regulatoryArea = getRegulatoryAreaById.execute(id)

        // Then
        assertThat(expectedRegulatoryArea).isEqualTo(regulatoryArea)
        assertThat(log.out).contains("GET regulatory area $id")
    }
}
