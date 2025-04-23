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
import org.mockito.ArgumentMatchers.anyList
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.Duration
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetTagsByRegulatoryAreasUTest {
    private val tagRepository: ITagRepository = mock()
    private val getTagsByRegulatoryAreas = GetTagsByRegulatoryAreas(tagRepository)

    @Test
    fun `execute should return a list of tags`(log: CapturedOutput) {
        // Given
        val regulatoryAreaIds = listOf(1, 2, 3)
        val expectedTags = listOf(aTag())
        given(tagRepository.findAllWithinByRegulatoryAreaIds(anyList(), any())).willReturn(expectedTags)

        // When
        val tags = getTagsByRegulatoryAreas.execute(regulatoryAreaIds)

        // Then
        assertThat(tags).containsAll(expectedTags)
        verify(tagRepository).findAllWithinByRegulatoryAreaIds(
            argThat { ids -> ids === regulatoryAreaIds },
            argThat { time ->
                Duration.between(time, ZonedDateTime.now()).abs() <= Duration.ofSeconds(1)
            },
        )
        assertThat(log.out).contains("Attempt to GET all tags from regulatory areas $regulatoryAreaIds")
        assertThat(log.out).contains("Found ${tags.size} tags")
    }
}
