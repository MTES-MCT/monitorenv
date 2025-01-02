package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class ArchiveOutdatedVigilanceAreasUTest {
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()
    private val archiveOutdatedVigilanceAreas = ArchiveOutdatedVigilanceAreas(vigilanceAreaRepository)

    @Test
    fun `execute should archive vigilance areas`(log: CapturedOutput) {
        // Given
        given(vigilanceAreaRepository.archiveOutdatedVigilanceAreas()).willReturn(2)

        // When
        archiveOutdatedVigilanceAreas.execute()

        // Then
        assertThat(log.out).contains("Attempt to ARCHIVE vigilance areas")
        assertThat(log.out).contains("2 vigilance areas archived")
    }
}
