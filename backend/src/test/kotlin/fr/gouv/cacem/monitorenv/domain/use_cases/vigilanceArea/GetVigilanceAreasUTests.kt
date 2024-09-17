package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures.VigilanceAreaFixture
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test

class GetVigilanceAreasUTests {
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    @Test
    fun `execute should return all vigilance areas`() {
        val vigilancesAreas =
            listOf(
                VigilanceAreaFixture.aVigilanceAreaEntity(),
                VigilanceAreaFixture.aVigilanceAreaEntityWithImagesAndLink(),
            )

        given(vigilanceAreaRepository.findAll()).willReturn(vigilancesAreas)

        val result = GetVigilanceAreas(vigilanceAreaRepository).execute()

        Assertions.assertThat(result.size).isEqualTo(2)
        Assertions.assertThat(result).isEqualTo(vigilancesAreas)
    }
}
