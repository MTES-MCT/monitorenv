package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class GetTrigramsUTests {
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    @Test
    fun `execute should return all trigrams`() {
        val trigrams = listOf("ABC", "DEF", "GHI")

        given(vigilanceAreaRepository.findAllTrigrams()).willReturn(trigrams)

        val result = GetTrigrams(vigilanceAreaRepository).execute()

        assertThat(trigrams).isEqualTo(result)
    }

    @Test
    fun `execute should return empty list if no trigrams`() {
        given(vigilanceAreaRepository.findAllTrigrams()).willReturn(emptyList())

        val result = GetTrigrams(vigilanceAreaRepository).execute()
        assertThat(emptyList<String>()).isEqualTo(result)
    }
}
