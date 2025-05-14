package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import java.time.ZonedDateTime

interface ITagRepository {
    fun findAllWithin(time: ZonedDateTime = ZonedDateTime.now()): List<TagEntity>

    fun findAllWithinByRegulatoryAreaIds(
        regulatoryAreaIds: List<Int>,
        time: ZonedDateTime = ZonedDateTime.now(),
    ): List<TagEntity>
}
