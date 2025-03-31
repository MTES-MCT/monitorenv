package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags

import fr.gouv.cacem.monitorenv.domain.entities.themes.SubTagEntity
import java.time.ZonedDateTime

data class SubTagInput(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
) {
    fun toSubTagEntity(): SubTagEntity =
        SubTagEntity(
            id = id,
            name = name,
            startedAt = startedAt,
            endedAt = endedAt,
        )
}
