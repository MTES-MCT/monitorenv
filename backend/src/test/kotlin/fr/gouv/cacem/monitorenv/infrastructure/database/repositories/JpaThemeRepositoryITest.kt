package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBThemeRepository
import jakarta.persistence.EntityManager
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
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
        val expectedThemesSize = 19
        val time = ZonedDateTime.parse("2024-01-01T00:00:00Z")

        // When
        val themes = jpaThemeRepository.findAllWithin(time)

        // Then
        assertEquals(expectedThemesSize, themes.size)
        themes.forEach { theme ->
            assertThat(theme.endedAt == null || theme.endedAt.isAfter(time)).isTrue()
            theme.subThemes.forEach { subTheme ->
                assertThat(subTheme.endedAt == null || subTheme.endedAt.isAfter(time)).isTrue()
            }
        }
    }

    @Test
    fun `findAllWithin should not return themes when validity range time is out of range`() {
        // Given
        val expectedThemesSize = 0

        // When
        val themes = jpaThemeRepository.findAllWithin(ZonedDateTime.parse("2100-01-01T00:00:00Z"))

        // Then
        assertEquals(expectedThemesSize, themes.size)
    }

    // TODO : Ajouter des données de test
//    @Transactional
//    @Test
//    fun `findAllWithinByRegulatoryAreaIds should return all regulatory themes with regulatory subThemes within validity range time`() {
//        // Given
//        val regulatoryAreaIds = listOf(16, 17)
//        val expectedTagSize = 3
//
//        // When
//        val regulatoryTags = jpaThemeRepository.findAllWithinByRegulatoryAreaIds(regulatoryAreaIds)
//
//        // Then
//        assertEquals(expectedTagSize, regulatoryTags.size)
//        regulatoryTags.forEach { regulatoryTag ->
//            // Clear cache otherwise we have not all subtags
//            entityManager.clear()
//            val baseTheme = dbThemeRepository.findByIdOrNull(regulatoryTag.id)
//            assertThat(baseTheme?.subThemes).hasSizeGreaterThanOrEqualTo(regulatoryTag.subThemes.size)
//            assertThat(regulatoryTag.endedAt == null || regulatoryTag.endedAt.isAfter(ZonedDateTime.now())).isTrue()
//            regulatoryTag.subThemes.forEach { subTheme ->
//                assertThat(subTheme.endedAt == null || subTheme.endedAt.isAfter(ZonedDateTime.now())).isTrue()
//            }
//        }
//    }
}
