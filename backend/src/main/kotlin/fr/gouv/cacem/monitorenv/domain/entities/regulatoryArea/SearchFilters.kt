package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

data class SearchFilters(
    val controlPlan: String?,
    val query: String?,
    val seaFronts: List<String>?,
    val tags: List<Int>?,
    val themes: List<Int>?,
    val onlyRecentsAreas: Boolean?,
)
