package fr.gouv.cacem.monitorenv.domain.entities.missions

data class ThemeEntity(
    val theme: String? = null,
    val subThemes: List<String>? = listOf(),
    val protectedSpecies: List<String>? = listOf(),
)
