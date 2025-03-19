package fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.themes.SubThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import java.time.ZonedDateTime
import kotlin.random.Random

class ThemeFixture {
    companion object {
        fun aTheme(
            id: Int = Random.nextInt(),
            name: String = "theme",
            startedAt: ZonedDateTime = ZonedDateTime.now(),
            endedAt: ZonedDateTime? = null,
            subThemes: List<SubThemeEntity> = listOf(),
        ): ThemeEntity =
            ThemeEntity(id = id, name = name, startedAt = startedAt, endedAt = endedAt, subThemes = subThemes)

        fun aSubTheme(
            id: Int = Random.nextInt(),
            name: String = "subTheme",
            startedAt: ZonedDateTime = ZonedDateTime.now(),
            endedAt: ZonedDateTime? = null,
        ): SubThemeEntity = SubThemeEntity(id = id, name = name, startedAt = startedAt, endedAt = endedAt)
    }
}
