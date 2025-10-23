package fr.gouv.cacem.monitorenv.domain.use_cases.vessels

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.repositories.IVesselRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.vessels.fixtures.VesselFixture.Companion.aVessel
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class SearchVesselsUTest {
    val vesselRepository: IVesselRepository = mock()
    val searchVessels: SearchVessels = SearchVessels(vesselRepository)

    @Test
    fun `execute should return vessels from searched query`() {
        // Given
        val searchedQuery = "SEARCH QUERY"
        val expectedVessel = aVessel()
        given(vesselRepository.search(searchedQuery)).willReturn(listOf(expectedVessel))

        // When
        val vessels = searchVessels.execute(searchedQuery)

        // Then
        assertThat(vessels).containsExactly(expectedVessel)
    }

    @Test
    fun `execute should emptylist from searched query when no vessels are found`() {
        // Given
        val searchedQuery = "SEARCH QUERY"
        given(vesselRepository.search(searchedQuery)).willReturn(emptyList())

        // When
        val vessels = searchVessels.execute(searchedQuery)

        // Then
        assertThat(vessels).isEmpty()
    }
}
