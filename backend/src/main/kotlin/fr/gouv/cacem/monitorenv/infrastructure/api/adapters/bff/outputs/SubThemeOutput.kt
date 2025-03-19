package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.themes.SubThemeEntity
import java.time.ZonedDateTime

data class SubThemeOutput(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
) {
    companion object {
        fun fromSubThemeEntity(subThemeEntity: SubThemeEntity): SubThemeOutput =
            SubThemeOutput(
                id = subThemeEntity.id,
                name = subThemeEntity.name,
                startedAt = subThemeEntity.startedAt,
                endedAt = subThemeEntity.endedAt,
            )
    }
}
