package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class GetVigilanceAreasUTests {
    @MockBean
    private lateinit var vigilanceAreaRepository: IVigilanceAreaRepository

    @Test
    fun `execute should return all vigilance areas`() {
        val vigilancesAreas = listOf(
            VigilanceAreaEntity(
                id = 1,
                comments = "Comments",
                isDeleted = false,
                isDraft = true,
            ),
            VigilanceAreaEntity(
                id = 2,
                comments = "Test Area",
                isDeleted = false,
                isDraft = true,
            ),
        )

        given(vigilanceAreaRepository.findAll()).willReturn(vigilancesAreas)

        val result = GetVigilanceAreas(vigilanceAreaRepository).execute()

        Assertions.assertThat(result.size).isEqualTo(2)
        Assertions.assertThat(result).isEqualTo(vigilancesAreas)
    }
}
