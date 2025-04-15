package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import java.time.ZonedDateTime

data class TagInput(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime?,
    val endedAt: ZonedDateTime?,
    val subTags: List<TagInput> = listOf(),
) {
    fun toTagEntity(): TagEntity =
        TagEntity(
            id = id,
            name = name,
            startedAt = startedAt,
            endedAt = endedAt,
            subTags = subTags.map { it.toTagEntity() },
        )
}
