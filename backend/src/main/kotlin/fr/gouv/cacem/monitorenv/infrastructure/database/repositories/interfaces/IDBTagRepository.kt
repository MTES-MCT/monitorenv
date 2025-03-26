package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagModel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.ZonedDateTime

interface IDBTagRepository : JpaRepository<TagModel, Int> {
    @Query(
        """SELECT DISTINCT tag FROM TagModel tag 
            LEFT JOIN FETCH tag.subTags subTag
        WHERE tag.startedAt <= :time AND (tag.endedAt IS NULL OR tag.endedAt > :time)
        AND (subTag IS NULL OR (subTag.startedAt <= :time AND (subTag.endedAt IS NULL OR subTag.endedAt > :time)))
            """,
    )
    fun findAllWithin(time: ZonedDateTime): List<TagModel>

    @Query(
        """SELECT DISTINCT tag FROM TagModel tag
            LEFT JOIN FETCH tag.subTags subTag
            INNER JOIN TagRegulatoryAreaModel tr 
                ON tr.tag.id = tag.id AND tr.regulatoryArea.id IN (:regulatoryAreaIds)
            LEFT JOIN SubTagRegulatoryAreaModel str 
                ON str.subTags.id = subTag.id AND str.regulatoryArea.id IN (:regulatoryAreaIds)
        WHERE tag.startedAt <= :time AND (tag.endedAt IS NULL OR tag.endedAt > :time)
        AND (subTag IS NULL OR (subTag.startedAt <= :time AND (subTag.endedAt IS NULL OR subTag.endedAt > :time)))
        AND (subTag IS NULL OR str.id IS NOT NULL)
            """,
    )
    fun findAllWithinByRegulatoryAreaIds(
        regulatoryAreaIds: List<Int>,
        time: ZonedDateTime,
    ): List<TagModel>
}
