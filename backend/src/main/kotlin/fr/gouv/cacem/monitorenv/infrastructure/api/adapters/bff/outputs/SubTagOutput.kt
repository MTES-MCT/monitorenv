package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.themes.SubTagEntity
import java.time.ZonedDateTime

data class SubTagOutput(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
) {
    companion object {
        fun fromSubTagEntity(subTagEntity: SubTagEntity): SubTagOutput =
            SubTagOutput(
                id = subTagEntity.id,
                name = subTagEntity.name,
                startedAt = subTagEntity.startedAt,
                endedAt = subTagEntity.endedAt,
            )
    }
}
