package fr.gouv.cacem.monitorenv.domain.use_cases.themes

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.argThat
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IThemeRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.Duration
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetThemesUTest {
    private val themeRepository: IThemeRepository = mock()
    private val getThemes = GetThemes(themeRepository)

    @Test
    fun `execute should return a list of themes`(log: CapturedOutput) {
        // Given
        val expectedThemes = listOf(aTheme())
        given(themeRepository.findAllWithin(any())).willReturn(expectedThemes)

        // When
        val themes = getThemes.execute()

        // Then
        assertThat(themes).containsAll(expectedThemes)
        verify(themeRepository).findAllWithin(
            argThat { time ->
                Duration.between(time, ZonedDateTime.now()).abs() <= Duration.ofSeconds(1)
            },
        )
        assertThat(log.out).contains("Attempt to GET all themes")
        assertThat(log.out).contains("Found ${themes.size} themes")
    }
}
