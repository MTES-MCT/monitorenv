package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.themes.TagEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.SubTagOutput.Companion.fromSubTagEntity
import java.time.ZonedDateTime

data class TagOutput(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
    val subTags: List<SubTagOutput>,
) {
    companion object {
        fun fromTagEntity(tagEntity: TagEntity): TagOutput =
            TagOutput(
                id = tagEntity.id,
                name = tagEntity.name,
                startedAt = tagEntity.startedAt,
                endedAt = tagEntity.endedAt,
                subTags = tagEntity.subTags.map { fromSubTagEntity(it) },
            )
    }
}
