package fr.gouv.cacem.monitorenv.domain.use_cases.natinfs

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.natinf.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.repositories.INatinfRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAllNatinfsUTest {
    private val natinfRepository: INatinfRepository = mock()
    private val getAllNatinfs = GetAllNatinfs(natinfRepository)

    @Test
    fun `execute should return all NATINF`(log: CapturedOutput) {
        // Given
        val expectedNatinfs =
            listOf(
                NatinfEntity(
                    natinfCode = 1,
                    regulation = null,
                    infraction = null,
                    infractionCategory = null,
                ),
            )
        given(natinfRepository.findAll()).willReturn(
            expectedNatinfs,
        )

        // When
        val natinfs = getAllNatinfs.execute()

        // Then
        assertThat(expectedNatinfs).isEqualTo(natinfs)
        assertThat(log.out).contains("Attempt to GET all natinfs")
        assertThat(log.out).contains("Found ${natinfs.size} natinfs")
    }
}
