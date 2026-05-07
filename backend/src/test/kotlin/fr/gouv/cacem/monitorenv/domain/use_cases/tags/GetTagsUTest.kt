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
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetTagsUTest {
    private val tagRepository: ITagRepository = mock()
    private val getTags = GetTags(tagRepository)

    @Test
    fun `execute should return a list of tags`(log: CapturedOutput) {
        // Given
        val expectedTags = listOf(aTag())
        val startedAt = ZonedDateTime.now()
        val endedAt = ZonedDateTime.now()
        given(tagRepository.findAllWithin(startedAt, endedAt)).willReturn(expectedTags)

        // When
        val tags = getTags.execute(startedAt, endedAt)

        // Then
        assertThat(tags).containsAll(expectedTags)
        verify(tagRepository).findAllWithin(startedAt, endedAt)
        assertThat(log.out).contains("Attempt to GET all tags")
        assertThat(log.out).contains("Found ${tags.size} tags")
    }
}
