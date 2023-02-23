package fr.gouv.cacem.monitorenv.domain.entities.missions

data class ThemeEntity(
  val theme: String,
  val subThemes: List<String>? = listOf(),
  val protectedSpecies: List<String>? = listOf()
)
