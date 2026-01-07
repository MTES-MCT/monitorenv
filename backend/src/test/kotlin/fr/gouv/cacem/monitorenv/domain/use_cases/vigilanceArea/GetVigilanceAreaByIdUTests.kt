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
class GetVigilanceAreaByIdUTests {
    private val vigilanceAreaRepository: IVigilanceAreaRepository = mock()

    @Test
    fun `execute should return vigilance area entity`(log: CapturedOutput) {
        val vigilanceAreaId = 3
        val expectedEntity = VigilanceAreaFixture.aVigilanceAreaEntity()

        given(vigilanceAreaRepository.findById(vigilanceAreaId)).willReturn(expectedEntity)

        val result = GetVigilanceAreaById(vigilanceAreaRepository).execute(vigilanceAreaId)

        assertThat(expectedEntity).isEqualTo(result)
        assertThat(log.out).contains("GET vigilance area $vigilanceAreaId")
    }
}
