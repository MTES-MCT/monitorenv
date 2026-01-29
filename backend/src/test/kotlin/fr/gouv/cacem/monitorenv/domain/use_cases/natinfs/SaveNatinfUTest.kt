package fr.gouv.cacem.monitorenv.domain.use_cases.natinfs

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.INatinfRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.natinfs.fixtures.NatinfFixture.Companion.aNatinf
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class SaveNatinfUTest {
    private val natinfRepository: INatinfRepository = mock()

    private val saveNatinf = SaveNatinf(natinfRepository)

    @Test
    fun `execute should save a natinf and return it`(log: CapturedOutput) {
        // Given
        val natinf = aNatinf()
        given(natinfRepository.save(natinf)).willReturn(natinf)

        // When
        val savedNatinf = saveNatinf.execute(natinf)

        // Then
        assertThat(savedNatinf).isEqualTo(natinf)
        assertThat(log.out).contains("Attempt to SAVE natinf from refnatinf ${natinf.refNatinf.id}")
        assertThat(log.out).contains("Natinf saved")
    }
}
