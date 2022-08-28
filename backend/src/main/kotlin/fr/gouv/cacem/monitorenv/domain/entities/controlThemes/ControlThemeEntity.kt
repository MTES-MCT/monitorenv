package fr.gouv.cacem.monitorenv.domain.entities.controlThemes

data class ControlThemeEntity(
        val id: Int,
        val theme_level_1: String,
        val theme_level_2: String? = null
        )
