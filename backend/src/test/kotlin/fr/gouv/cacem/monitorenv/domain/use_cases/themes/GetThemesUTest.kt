package fr.gouv.cacem.monitorenv.domain.use_cases.themes

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IThemeRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetThemesUTest {

    private val themesRepository: IThemeRepository = mock()
    private val getThemes = GetThemes(themesRepository)

    @Test
    fun `execute should return a list of themes`(log: CapturedOutput) {
        // Given
        val expectedThemes = listOf(aTheme())
        given(themesRepository.findAll()).willReturn(expectedThemes)

        // When
        val themes = getThemes.execute()

        // Then
        assertThat(themes).containsAll(expectedThemes)

        assertThat(log.out).contains("Attempt to GET all themes")
        assertThat(log.out).contains("Found ${themes.size} themes")
    }
}