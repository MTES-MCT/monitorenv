package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.ZonedDateTime

interface IDBThemeRepository : JpaRepository<ThemeModel, Int> {
    @Query(
        """SELECT DISTINCT theme FROM ThemeModel theme
            LEFT JOIN FETCH theme.subThemes subThemes
        WHERE theme.parent IS NULL AND theme.startedAt <= :endedAt AND (theme.endedAt IS NULL OR theme.endedAt > :startedAt)
        AND (subThemes IS NULL OR (subThemes.startedAt <= :endedAt AND (subThemes.endedAt IS NULL OR subThemes.endedAt > :startedAt)))
            """,
    )
    fun findAllWithin(
        startedAt: ZonedDateTime,
        endedAt: ZonedDateTime,
    ): List<ThemeModel>

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

    @Query(
        """
        SELECT DISTINCT theme FROM ThemeModel theme
            LEFT JOIN FETCH theme.subThemes subTheme
            INNER JOIN ThemeVigilanceAreaModel tv
                ON tv.theme.id = theme.id AND tv.vigilanceArea.id IN (:vigilanceAreasIds)
            LEFT JOIN ThemeVigilanceAreaModel stv
                ON stv.theme.id = subTheme.id AND stv.vigilanceArea.id IN (:vigilanceAreasIds)
        WHERE theme.parent IS NULL AND theme.startedAt <= :time AND (theme.endedAt IS NULL OR theme.endedAt > :time)
        AND (subTheme.id IS NULL OR (subTheme.startedAt <= :time AND (subTheme.endedAt IS NULL OR subTheme.endedAt > :time)))
        AND (subTheme.id IS NULL OR stv.id IS NOT NULL)
        """,
    )
    fun findAllWithinByVigilanceAreasIds(
        vigilanceAreasIds: List<Int>,
        time: ZonedDateTime,
    ): List<ThemeModel>

    @Query(
        value = """SELECT COALESCE(ARRAY_AGG(DISTINCT control_plan_themes_id) FILTER (WHERE control_plan_themes_id IS NOT NULL), '{}') as themes_ids,
            COALESCE(ARRAY_AGG(DISTINCT control_plan_sub_themes_id) FILTER (WHERE control_plan_sub_themes_id IS NOT NULL), '{}') as sub_themes_ids,
            COALESCE(ARRAY_AGG(DISTINCT control_plan_tags_id) FILTER (WHERE control_plan_tags_id IS NOT NULL), '{}') as tags_ids
                FROM themes WHERE id IN (:ids)
                """,
        nativeQuery = true,
    )
    fun findAllControlPlanThemeIdsByIds(ids: List<Int>): Array<Any>
}
