package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import java.time.ZonedDateTime

interface ITagRepository {
    fun findAllWithin(
        startedAt: ZonedDateTime,
        endedAt: ZonedDateTime,
    ): List<TagEntity>

    fun findAllWithinByRegulatoryAreaIds(
        regulatoryAreaIds: List<Int>,
        time: ZonedDateTime = ZonedDateTime.now(),
    ): List<TagEntity>

    fun findAllWithinByVigilanceAreasIds(
        vigilanceAreasIds: List<Int>,
        time: ZonedDateTime = ZonedDateTime.now(),
    ): List<TagEntity>

    fun save(
        tag: TagEntity,
        parentId: Int?,
    ): TagEntity
}
