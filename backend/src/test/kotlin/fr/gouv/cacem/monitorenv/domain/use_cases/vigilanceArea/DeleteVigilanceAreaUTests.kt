package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class DeleteVigilanceAreaUTests {
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    @Test
    fun `execute should delete vigilanceArea`(log: CapturedOutput) {
        val vigilanceAreaId = 1

        DeleteVigilanceArea(vigilanceAreaRepository).execute(vigilanceAreaId)

        verify(vigilanceAreaRepository).delete(vigilanceAreaId)
        assertThat(log.out).contains("Attempt to DELETE vigilance area $vigilanceAreaId")
        assertThat(log.out).contains("Vigilance area $vigilanceAreaId deleted")
    }
}
