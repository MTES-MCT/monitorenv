package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import java.time.ZonedDateTime
import java.util.Collections.emptyList

data class CreaterOrUpdateTagInput(
    val id: Int?,
    val endedAt: ZonedDateTime?,
    val name: String,
    val parentId: Int?,
    val startedAt: ZonedDateTime?,
) {
    fun toTagEntity(): TagEntity =
        TagEntity(
            id = id,
            name = name,
            startedAt = startedAt,
            endedAt = endedAt,
            subTags = emptyList(),
        )
}
