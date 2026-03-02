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
class GetRegulatoryAreaByIdsUTest {
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository = mock()
    private val getRegulatoryAreaByIds = GetRegulatoryAreaByIds(regulatoryAreaRepository)

    @Test
    fun `execute should return regulatory area by its id`(log: CapturedOutput) {
        // Given
        val id = listOf(1)
        val expectedRegulatoryArea = listOf(RegulatoryAreaNewFixture.aNewRegulatoryArea())
        given(regulatoryAreaRepository.findAllByIds(id)).willReturn(expectedRegulatoryArea)

        // When
        val regulatoryArea = getRegulatoryAreaByIds.execute(id)

        // Then
        assertThat(expectedRegulatoryArea).isEqualTo(regulatoryArea)
        assertThat(log.out).contains("GET regulatory area $id")
    }
}
