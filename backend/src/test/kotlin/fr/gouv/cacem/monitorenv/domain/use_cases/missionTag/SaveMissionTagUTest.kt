package fr.gouv.cacem.monitorenv.domain.use_cases.missionTag

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionTagsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missionTag.fixtures.MissionTagFixture.Companion.aMissionTagEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class SaveMissionTagUTest {
    private val missionTagsRepository: IMissionTagsRepository = mock()
    private val saveMissionTag = SaveMissionTag(missionTagsRepository)

    @Test
    fun `execute update a mission tag and log it`(log: CapturedOutput) {
        // Given
        val missionTag = aMissionTagEntity()
        given(missionTagsRepository.save(missionTag)).willReturn(missionTag)

        // When
        val savedTag = saveMissionTag.execute(missionTag)

        // Then
        assertThat(savedTag).usingRecursiveComparison().isEqualTo(missionTag)
        verify(missionTagsRepository).save(missionTag)
        assertThat(log.out).contains("Attempt to update with id ${missionTag.id}")
        assertThat(log.out).contains("Mission Tag ${savedTag.id} saved")
    }

    @Test
    fun `execute create a mission tag and log it`(log: CapturedOutput) {
        // Given
        val missionTag = aMissionTagEntity(id = null)
        given(missionTagsRepository.save(missionTag)).willReturn(missionTag)

        // When
        val savedTag = saveMissionTag.execute(missionTag)

        // Then
        assertThat(savedTag).usingRecursiveComparison().isEqualTo(missionTag)
        verify(missionTagsRepository).save(missionTag)
        assertThat(log.out).contains("Attempt to create a mission tag")
        assertThat(log.out).contains("Mission Tag ${savedTag.id} saved")
    }
}
