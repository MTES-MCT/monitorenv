package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemeRepository
import jakarta.persistence.EntityManager
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime

class JpaThemeRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaThemeRepository: JpaThemeRepository

    @Autowired
    private lateinit var dbThemeRepository: IDBThemeRepository

    @Autowired
    private lateinit var entityManager: EntityManager

    @Test
    fun `findAllWithin should return all themes with subThemes within validity range time`() {
        // Given
        val expectedThemeSize = 7

        // When
        val themes = jpaThemeRepository.findAllWithin(ZonedDateTime.now())

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
    fun `findAllWithin should not return themes when validity range time is out of range`() {
        // Given
        val expectedThemeSize = 0

        // When
        val themes = jpaThemeRepository.findAllWithin(ZonedDateTime.parse("2099-12-31T00:00:00+00:00"))

        // Then
        assertEquals(expectedThemeSize, themes.size)
    }

    @Transactional
    @Test
    fun `findAllWithinByRegulatoryAreaIds should return all regulatory themes with regulatory subThemes within validity range time`() {
        // Given
        val regulatoryAreaIds = listOf(16, 17)
        val expectedThemeSize = 3

        // When
        val regulatoryThemes = jpaThemeRepository.findAllWithinByRegulatoryAreaIds(regulatoryAreaIds)

        // Then
        assertEquals(expectedThemeSize, regulatoryThemes.size)
        regulatoryThemes.forEach { regulatoryTheme ->
            // Clear cache otherwise we have not all subthemes
            entityManager.clear()
            val baseTheme = dbThemeRepository.findByIdOrNull(regulatoryTheme.id)
            assertThat(baseTheme?.subThemes).hasSizeGreaterThanOrEqualTo(regulatoryTheme.subThemes.size)
            assertThat(regulatoryTheme.endedAt == null || regulatoryTheme.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            regulatoryTheme.subThemes.forEach { subTheme ->
                assertThat(subTheme.endedAt == null || subTheme.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            }
        }
    }
}
