package fr.gouv.cacem.monitorenv.domain.use_cases.themes

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

@ExtendWith(OutputCaptureExtension::class)
class SaveThemeUTest {
    private val themeRepository: IThemeRepository = mock()
    private val saveTheme = SaveTheme(themeRepository)

    @Test
    fun `execute should update a theme and log it`(log: CapturedOutput) {
        // Given
        val theme = aTheme()
        given(themeRepository.save(theme)).willReturn(theme)

        // When
        val savedTheme = saveTheme.execute(theme)

        // Then
        assertThat(savedTheme).usingRecursiveComparison().isEqualTo(theme)
        verify(themeRepository).save(theme)
        assertThat(log.out).contains("Attempt to update with id ${theme.id}")
        assertThat(log.out).contains("Theme ${savedTheme.id} saved")
    }

    @Test
    fun `execute create a tag and log it`(log: CapturedOutput) {
        // Given
        val theme = aTheme(id = null)
        given(themeRepository.save(theme)).willReturn(theme)

        // When
        val savedTheme = saveTheme.execute(theme)

        // Then
        assertThat(savedTheme).usingRecursiveComparison().isEqualTo(theme)
        verify(themeRepository).save(theme)
        assertThat(log.out).contains("Attempt to create a theme")
        assertThat(log.out).contains("Theme ${savedTheme.id} saved")
    }
}
