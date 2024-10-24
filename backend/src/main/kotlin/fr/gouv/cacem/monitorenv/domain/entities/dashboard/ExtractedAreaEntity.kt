package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class ExtractedAreaEntity(
    val inseeCode: String?,
    val reportingIds: List<Int>,
    val regulatoryAreaIds: List<Int>,
    val ampIds: List<Int>,
    val vigilanceAreaIds: List<Int>,
)
