package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

data class SearchFilters(
    val controlPlan: String? = null,
    val query: String? = null,
    val seaFronts: List<String>? = null,
    val tags: List<Int>? = null,
    val themes: List<Int>? = null,
    val onlyRecentsAreas: Boolean? = false,
    val extent: List<Double>? = null,
)
