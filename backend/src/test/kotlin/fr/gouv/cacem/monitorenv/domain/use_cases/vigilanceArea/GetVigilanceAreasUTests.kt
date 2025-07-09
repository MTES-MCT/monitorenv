package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures.VigilanceAreaFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetVigilanceAreasUTests {
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    @Test
    fun `execute should return all vigilance areas`(log: CapturedOutput) {
        val vigilancesAreas =
            listOf(
                VigilanceAreaFixture.aVigilanceAreaEntity(),
                VigilanceAreaFixture.aVigilanceAreaEntityWithImagesAndLink(),
            )

        given(vigilanceAreaRepository.findAll()).willReturn(vigilancesAreas)

        val result = GetVigilanceAreas(vigilanceAreaRepository).execute()

        assertThat(result).isEqualTo(vigilancesAreas)
        assertThat(log.out).contains("Attempt to GET all vigilance areas")
        assertThat(log.out).contains("Found ${result.size} vigilance areas")
    }
}
