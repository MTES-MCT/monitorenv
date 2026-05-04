package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.fixtures.RegulatoryAreaFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetRegulatoryAreaByIdsUTest {
    private val regulatoryAreaRepository: IRegulatoryAreaRepository = mock()
    private val getRegulatoryAreaByIds = GetRegulatoryAreaByIds(regulatoryAreaRepository)

    @Test
    fun `execute should return regulatory area by its id`(log: CapturedOutput) {
        // Given
        val id = listOf(1)
        val expectedRegulatoryArea = listOf(RegulatoryAreaFixture.aRegulatoryArea())
        given(regulatoryAreaRepository.findAllByIds(id, AxisEnum.NORTH_SOUTH)).willReturn(expectedRegulatoryArea)

        // When
        val regulatoryArea = getRegulatoryAreaByIds.execute(id, AxisEnum.NORTH_SOUTH)

        // Then
        assertThat(expectedRegulatoryArea).isEqualTo(regulatoryArea)
        assertThat(log.out).contains("GET regulatory area $id")
    }
}
