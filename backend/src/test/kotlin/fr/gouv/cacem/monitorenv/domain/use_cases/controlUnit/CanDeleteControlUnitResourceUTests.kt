package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class CanDeleteControlUnitResourceUTests {
    @Mock
    private val missionRepository: IMissionRepository = mock()

    @Test
    fun `execute should return true when missions are empty`(log: CapturedOutput) {
        val controlUnitResourceId = 1

        given(missionRepository.findByControlUnitResourceId(controlUnitResourceId))
            .willReturn(listOf())

        val result = CanDeleteControlUnitResource(missionRepository).execute(controlUnitResourceId)

        assertThat(result).isTrue
        assertThat(log.out).contains("Can control unit resource $controlUnitResourceId be deleted")
    }

    @Test
    fun `execute should return false when missions are not empty`() {
        val controlUnitResourceId = 1

        given(missionRepository.findByControlUnitResourceId(controlUnitResourceId))
            .willReturn(listOf(aMissionEntity()))

        val result = CanDeleteControlUnitResource(missionRepository).execute(controlUnitResourceId)

        assertThat(result).isFalse
    }
}
