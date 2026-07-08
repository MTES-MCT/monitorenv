package fr.gouv.cacem.monitorenv.domain.use_cases.facade

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.entities.seafront.FacadeEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

class GetFacadesUTest {
    private val facadeRepository: IFacadeAreasRepository = mock()
    private val getFacades = GetFacades(facadeRepository)

    @ExtendWith(OutputCaptureExtension::class)
    @Test
    fun `execute should return all facades`(log: CapturedOutput) {
        // Given
        val expectedFacades = listOf(FacadeEntity(id = 1, facade = "NAMO"))
        given(facadeRepository.findAll()).willReturn(expectedFacades)

        // When
        val missionTags = getFacades.execute()

        // Then
        assertThat(missionTags).containsAll(expectedFacades)
        assertThat(log.out).contains("Attempt to GET all facades")
        assertThat(log.out).contains("Found 1 facades")
    }
}
