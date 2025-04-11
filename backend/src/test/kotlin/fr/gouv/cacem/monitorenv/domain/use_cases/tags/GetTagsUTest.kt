package fr.gouv.cacem.monitorenv.domain.use_cases.tags

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.argThat
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
import java.time.Duration
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetTagsUTest {
    private val tagRepository: ITagRepository = mock()
    private val getTags = GetTags(tagRepository)

    @Test
    fun `execute should return a list of tags`(log: CapturedOutput) {
        // Given
        val expectedTags = listOf(aTag())
        given(tagRepository.findAllWithin(any())).willReturn(expectedTags)

        // When
        val tags = getTags.execute()

        // Then
        assertThat(tags).containsAll(expectedTags)
        verify(tagRepository).findAllWithin(
            argThat { time ->
                Duration.between(time, ZonedDateTime.now()).abs() <= Duration.ofSeconds(1)
            },
        )
        assertThat(log.out).contains("Attempt to GET all tags")
        assertThat(log.out).contains("Found ${tags.size} tags")
    }
}
