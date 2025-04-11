package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.ZonedDateTime

interface IDBThemeRepository : JpaRepository<ThemeModel, Int> {
    @Query(
        """SELECT DISTINCT theme FROM ThemeModel theme 
            LEFT JOIN FETCH theme.subThemes subThemes
        WHERE theme.parent IS NULL AND theme.startedAt <= :time AND (theme.endedAt IS NULL OR theme.endedAt > :time)
        AND (subThemes IS NULL OR (subThemes.startedAt <= :time AND (subThemes.endedAt IS NULL OR subThemes.endedAt > :time)))
            """,
    )
    fun findAllWithin(time: ZonedDateTime): List<ThemeModel>

    @Query(
        """SELECT DISTINCT theme FROM ThemeModel theme 
            LEFT JOIN FETCH theme.subThemes subTheme
            INNER JOIN ThemeRegulatoryAreaModel tr 
                ON tr.theme.id = theme.id AND tr.regulatoryArea.id IN (:regulatoryAreaIds)
            LEFT JOIN ThemeRegulatoryAreaModel str 
                ON str.theme.id = subTheme.id AND str.regulatoryArea.id IN (:regulatoryAreaIds)
        WHERE theme.parent IS NULL AND theme.startedAt <= :time AND (theme.endedAt IS NULL OR theme.endedAt > :time)
        AND (subTheme.id IS NULL OR (subTheme.startedAt <= :time AND (subTheme.endedAt IS NULL OR subTheme.endedAt > :time)))
        AND (subTheme.id IS NULL OR str.id IS NOT NULL)
            """,
    )
    fun findAllWithinByRegulatoryAreaIds(
        regulatoryAreaIds: List<Int>,
        time: ZonedDateTime,
    ): List<ThemeModel>
}
