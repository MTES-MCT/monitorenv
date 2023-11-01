package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

data class ThemeEntity(
    val theme: String? = null,
    val subThemes: List<String>? = listOf(),
    val protectedSpecies: List<String>? = listOf()
)
