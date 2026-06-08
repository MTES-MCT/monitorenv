package fr.gouv.cacem.monitorenv.domain.use_cases.missionTag

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionTagsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missionTag.fixtures.MissionTagFixture.Companion.aMissionTagEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetMissionTagsUTest {
    private val missionTagsRepository: IMissionTagsRepository = mock()
    private val getMissionTags = GetMissionTags(missionTagsRepository)

    @Test
    fun `execute should return mission tags`(log: CapturedOutput) {
        // Given
        val missionTagEntity = aMissionTagEntity()
        given(missionTagsRepository.findAll()).willReturn(listOf(missionTagEntity))

        // When
        val missionTags = getMissionTags.execute()

        // Then
        assertThat(missionTags).containsAll(listOf(missionTagEntity))
        assertThat(log.out).contains("Attempt to GET all mission tags")
        assertThat(log.out).contains("Found 1 mission tags")
    }
}
