package fr.gouv.cacem.monitorenv.domain.use_cases.refNatinfs

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.repositories.IRefNatinfRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.refNatinfs.fixtures.RefNatinfFixture.Companion.aRefNatinf
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.Mock

class GetAllRefNatinfsUTest {
    @Mock
    private val refINatinfRepository: IRefNatinfRepository = mock()

    private val getAllRefNatinfs = GetAllRefNatinfs(refINatinfRepository)

    @Test
    fun `execute should return all the refNatinfs`() {
        // Given
        val expectedRefNatinfs = listOf(aRefNatinf())
        given(refINatinfRepository.findAll()).willReturn(expectedRefNatinfs)

        // When
        val refNatinfs = getAllRefNatinfs.execute()

        // Then
        assertThat(refNatinfs).isEqualTo(expectedRefNatinfs)
    }
}
