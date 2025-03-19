package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.time.ZonedDateTime

class JpaThemeRepositoryITest : AbstractDBTests() {

    @Autowired
    private lateinit var jpaThemeRepository: JpaThemeRepository

    @Test
    fun `findAll should return all themes with subThemes within validity range ti`() {
        // Given
        val expectedThemeSize = 7

        // When
        val themes = jpaThemeRepository.findAll()

        // Then
        assertEquals(expectedThemeSize, themes.size)
        themes.forEach { theme ->
            assertThat(theme.endedAt == null || theme.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            theme.subThemes.forEach { subTheme ->
                assertThat(subTheme.endedAt == null || subTheme.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            }
        }
    }

    @Test
    fun `findAll should not return themes when validity range time is out of range`() {
        // Given
        val expectedThemeSize = 0

        // When
        val themes = jpaThemeRepository.findAll(ZonedDateTime.parse("2099-12-31T00:00:00+00:00"))

        // Then
        assertEquals(expectedThemeSize, themes.size)
    }
}