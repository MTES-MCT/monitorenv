package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlTheme.ControlThemeEntity

data class ControlThemeDataOutput(
    val id: Int,
    val themeLevel1: String,
    val themeLevel2: String? = null
) {
    companion object {
        fun fromControlThemeEntity(controlTheme: ControlThemeEntity) = ControlThemeDataOutput(
            id = controlTheme.id,
            themeLevel1 = controlTheme.themeLevel1,
            themeLevel2 = controlTheme.themeLevel2
        )
    }
}
