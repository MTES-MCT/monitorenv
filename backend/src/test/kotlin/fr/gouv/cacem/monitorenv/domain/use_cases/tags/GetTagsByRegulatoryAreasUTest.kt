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
    private val themesRepository: ITagRepository = mock()
    private val getTagsByRegulatoryAreas = GetTagsByRegulatoryAreas(themesRepository)

    @Test
    fun `execute should return a list of themes`(log: CapturedOutput) {
        // Given
        val regulationIds = listOf(1, 2, 3)
        val expectedThemes = listOf(aTag())
        given(themesRepository.findAllWithinByRegulatoryAreaIds(anyList(), any())).willReturn(expectedThemes)

        // When
        val themes = getTagsByRegulatoryAreas.execute(regulationIds)

        // Then
        assertThat(themes).containsAll(expectedThemes)
        verify(themesRepository).findAllWithinByRegulatoryAreaIds(
            argThat { ids -> ids === regulationIds },
            argThat { time ->
                Duration.between(time, ZonedDateTime.now()).abs() <= Duration.ofSeconds(1)
            },
        )
        assertThat(log.out).contains("Attempt to GET all tags from regulations $regulationIds")
        assertThat(log.out).contains("Found ${themes.size} tags")
    }
}
