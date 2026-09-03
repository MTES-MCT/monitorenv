package fr.gouv.cacem.monitorenv.domain.use_cases.species

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.ISpeciesRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.species.fixtures.SpecyFixture.Companion.aSpecy
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetSpeciesUTest {
    private val speciesRepository: ISpeciesRepository = mock()
    private val getSpecies = GetSpecies(speciesRepository)

    @Test
    fun `execute should return a list of species`(log: CapturedOutput) {
        // Given
        val expectedSpecies = listOf(aSpecy())
        given(speciesRepository.findAll()).willReturn(expectedSpecies)

        // When
        val species = getSpecies.execute()

        // Then
        assertThat(species).containsAll(expectedSpecies)
        verify(speciesRepository).findAll()
        assertThat(log.out).contains("Attempt to GET all species")
        assertThat(log.out).contains("Found ${species.size} species")
    }
}
