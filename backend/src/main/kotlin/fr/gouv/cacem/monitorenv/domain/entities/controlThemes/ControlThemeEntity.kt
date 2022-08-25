package fr.gouv.cacem.monitorenv.domain.entities.controlThemes

data class ControlThemeEntity(
        val id: Int,
        val topic_level_1: String,
        val topic_level_2: String? = null
        )
