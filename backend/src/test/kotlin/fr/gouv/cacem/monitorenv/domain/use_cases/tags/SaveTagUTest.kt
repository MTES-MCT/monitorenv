package fr.gouv.cacem.monitorenv.domain.use_cases.tags

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.ITagRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class SaveTagUTest {
    private val tagRepository: ITagRepository = mock()
    private val saveTag = SaveTag(tagRepository)

    @Test
    fun `execute udpate a tag and log it`(log: CapturedOutput) {
        // Given
        val tag = aTag()
        given(tagRepository.save(tag, null)).willReturn(tag)

        // When
        val savedTag = saveTag.execute(tag, null)

        // Then
        assertThat(savedTag).usingRecursiveComparison().isEqualTo(tag)
        verify(tagRepository).save(tag, null)
        assertThat(log.out).contains("Attempt to update with id ${tag.id}")
        assertThat(log.out).contains("Tag ${savedTag.id} saved")
    }

    @Test
    fun `execute create a tag and log it`(log: CapturedOutput) {
        // Given
        val tag = aTag(id = null)
        given(tagRepository.save(tag, null)).willReturn(tag)

        // When
        val savedTag = saveTag.execute(tag, null)

        // Then
        assertThat(savedTag).usingRecursiveComparison().isEqualTo(tag)
        verify(tagRepository).save(tag, null)
        assertThat(log.out).contains("Attempt to create a tag")
        assertThat(log.out).contains("Tag ${savedTag.id} saved")
    }
}
