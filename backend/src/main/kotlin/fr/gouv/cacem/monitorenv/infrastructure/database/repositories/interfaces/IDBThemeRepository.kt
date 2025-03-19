package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.ZonedDateTime

interface IDBThemeRepository : JpaRepository<ThemeModel, Int> {

    @Query(
        """SELECT DISTINCT theme FROM ThemeModel theme 
            LEFT JOIN FETCH theme.subThemes subTheme
        WHERE theme.startedAt <= :time AND (theme.endedAt IS NULL OR theme.endedAt > :time)
        AND (subTheme IS NULL OR (subTheme.startedAt <= :time AND (subTheme.endedAt IS NULL OR subTheme.endedAt > :time)))
            """,
    )
    fun findAllCurrent(time: ZonedDateTime = ZonedDateTime.now()): List<ThemeModel>
}
