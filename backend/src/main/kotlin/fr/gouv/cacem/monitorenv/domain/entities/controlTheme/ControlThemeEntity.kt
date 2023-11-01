package fr.gouv.cacem.monitorenv.domain.entities.controlTheme

data class ControlThemeEntity(
    val id: Int,
    val themeLevel1: String,
    val themeLevel2: String? = null
)
