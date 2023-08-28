package fr.gouv.cacem.monitorenv.domain.entities.mission

data class ResourceUnitEntity(
    val administration: String? = null,
    val unit: String? = null,
    val resources: List<String>? = listOf(),
    val contact: String? = null,
)
