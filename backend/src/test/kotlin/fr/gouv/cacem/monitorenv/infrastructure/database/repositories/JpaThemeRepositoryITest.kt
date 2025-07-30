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
        val expectedThemesSize = 19
        val startedAt = ZonedDateTime.parse("2024-01-01T00:00:00Z")
        val endedAt = ZonedDateTime.parse("2024-12-31T23:59:59Z")

        // When
        val themes = jpaThemeRepository.findAllWithin(startedAt = startedAt, endedAt = endedAt)

        // Then
        assertEquals(expectedThemesSize, themes.size)
        themes.forEach { theme ->
            assertThat(theme.endedAt == null || theme.endedAt.isAfter(startedAt)).isTrue()
            theme.subThemes.forEach { subTheme ->
                assertThat(subTheme.endedAt == null || subTheme.endedAt.isAfter(startedAt)).isTrue()
            }
        }
    }

    @Test
    fun `findAllWithin should not return themes when validity range time is out of range`() {
        // Given
        val expectedThemesSize = 0

        // When
        val themes =
            jpaThemeRepository.findAllWithin(
                ZonedDateTime.parse("2100-01-01T00:00:00Z"),
                ZonedDateTime.parse("2101-01-01T00:00:00Z"),
            )

        // Then
        assertEquals(expectedThemesSize, themes.size)
    }

    @Test
    fun `findEnvActionControlPlanByIds should return legacy control plan from themes ids`() {
        // Given
        val themesIds = listOf(1, 147, 318, 357)

        // When
        val controlPlans = jpaThemeRepository.findEnvActionControlPlanByIds(themesIds)

        // Then
        assertThat(controlPlans.themeId).isEqualTo(1)
        assertThat(controlPlans.subThemeIds).containsExactlyInAnyOrder(34, 233)
        assertThat(controlPlans.tagIds).containsExactlyInAnyOrder(10)
    }

    @Test
    fun `findEnvActionControlPlanByIds should return empty legacy control plan from empty themeIds`() {
        // Given
        val themesIds = listOf<Int>()

        // When
        val controlPlans = jpaThemeRepository.findEnvActionControlPlanByIds(themesIds)

        // Then
        assertThat(controlPlans.themeId).isNull()
        assertThat(controlPlans.subThemeIds).isEmpty()
        assertThat(controlPlans.tagIds).isEmpty()
    }

    @Transactional
    @Test
    fun `findAllWithinByVigilanceAreaIds should return all vigilance areas themes with subThemes within validity range time`() {
        // Given
        val vigilanceAreaIds = listOf(2)
        val expectedThemeSize = 1

        // When
        val vigilanceAreasThemes = jpaThemeRepository.findAllWithinByVigilanceAreasIds(vigilanceAreaIds)

        // Then
        assertEquals(expectedThemeSize, vigilanceAreasThemes.size)
        vigilanceAreasThemes.forEach { vigilanceAreaTheme ->
            // Clear cache otherwise we have not all subthemes
            entityManager.clear()
            val baseTheme = dbThemeRepository.findByIdOrNull(vigilanceAreaTheme.id)
            assertThat(baseTheme?.subThemes).hasSizeGreaterThanOrEqualTo(vigilanceAreaTheme.subThemes.size)
            assertThat(
                vigilanceAreaTheme.endedAt == null || vigilanceAreaTheme.endedAt.isAfter(ZonedDateTime.now()),
            ).isTrue()
            vigilanceAreaTheme.subThemes.forEach { subTheme ->
                assertThat(subTheme.endedAt == null || subTheme.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            }
        }
    }

    @Transactional
    @Test
    fun `findAllWithinByRegulatoryAreaIds should return all regulatory areas themes with subThemes within validity range time`() {
        // Given
        val regulatoryAreaIds = listOf(16, 17)
        val expectedThemeSize = 2

        // When
        val regulatoryAreasThemes = jpaThemeRepository.findAllWithinByRegulatoryAreaIds(regulatoryAreaIds)

        // Then
        assertEquals(expectedThemeSize, regulatoryAreasThemes.size)
        regulatoryAreasThemes.forEach { regulatoryAreaTheme ->
            // Clear cache otherwise we have not all subthemes
            entityManager.clear()
            val baseTheme = dbThemeRepository.findByIdOrNull(regulatoryAreaTheme.id)
            assertThat(baseTheme?.subThemes).hasSizeGreaterThanOrEqualTo(regulatoryAreaTheme.subThemes.size)
            assertThat(
                regulatoryAreaTheme.endedAt == null || regulatoryAreaTheme.endedAt.isAfter(ZonedDateTime.now()),
            ).isTrue()
            regulatoryAreaTheme.subThemes.forEach { subTheme ->
                assertThat(subTheme.endedAt == null || subTheme.endedAt.isAfter(ZonedDateTime.now())).isTrue()
            }
        }
    }
}
