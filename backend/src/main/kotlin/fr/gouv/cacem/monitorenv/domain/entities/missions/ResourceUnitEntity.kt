package fr.gouv.cacem.monitorenv.domain.entities.missions

data class ResourceUnitEntity(
    val administration: String? = null,
    val unit: String? = null,
    val resources: List<String>? = listOf()
)
