package fr.gouv.cacem.monitorenv.domain.use_cases.facade

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.repositories.ISeaFrontRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

class GetSeaFrontUTest {
    private val seaFrontRepository: ISeaFrontRepository = mock()
    private val getSeaFronts = GetSeaFronts(seaFrontRepository)

    @ExtendWith(OutputCaptureExtension::class)
    @Test
    fun `execute should return all facades`(log: CapturedOutput) {
        // Given
        val expectedFacades = listOf("NAMO")
        given(seaFrontRepository.findAllFacade()).willReturn(expectedFacades)

        // When
        val missionTags = getSeaFronts.execute()

        // Then
        assertThat(missionTags).containsAll(expectedFacades)
        assertThat(log.out).contains("Attempt to GET all facades")
        assertThat(log.out).contains("Found 1 facades")
    }
}
