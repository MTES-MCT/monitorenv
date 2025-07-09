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
class GetVigilanceAreasByIdsUTest {
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    private val getVigilanceAreasByIds = GetVigilanceAreasByIds(vigilanceAreaRepository)

    @Test
    fun `execute should return all vigilance areas that match ids`(log: CapturedOutput) {
        val ids = listOf(1, 2, 3)
        val vigilancesAreas =
            listOf(
                VigilanceAreaFixture.aVigilanceAreaEntity(id = 1),
                VigilanceAreaFixture.aVigilanceAreaEntityWithImagesAndLink(),
                VigilanceAreaFixture.aVigilanceAreaEntity(id = 3),
            )

        given(vigilanceAreaRepository.findAllById(ids)).willReturn(vigilancesAreas)

        val result = getVigilanceAreasByIds.execute(ids)

        assertThat(result).isEqualTo(vigilancesAreas)
        assertThat(log.out).contains("Attempt to GET vigilance areas withs ids: $ids")
        assertThat(log.out).contains("Found ${result?.size} vigilance areas")
    }
}
