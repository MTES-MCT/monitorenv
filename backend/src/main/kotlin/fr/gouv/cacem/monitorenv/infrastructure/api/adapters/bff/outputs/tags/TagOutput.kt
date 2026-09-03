package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import java.time.ZonedDateTime

data class TagOutput(
    val id: Int?,
    val codeFao: String?,
    val name: String,
    val startedAt: ZonedDateTime?,
    val endedAt: ZonedDateTime?,
    val subTags: List<TagOutput>,
) {
    companion object {
        fun fromTagEntity(tagEntity: TagEntity): TagOutput =
            TagOutput(
                id = tagEntity.id,
                codeFao = tagEntity.codeFao,
                name = tagEntity.name,
                startedAt = tagEntity.startedAt,
                endedAt = tagEntity.endedAt,
                subTags = tagEntity.subTags.map { fromTagEntity(it) },
            )
    }
}
