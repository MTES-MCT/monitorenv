package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class ExtractedAreaEntity(
    val inseeCode: String?,
    val reportings: List<Int>,
    val regulatoryAreas: List<Int>,
    val amps: List<Int>,
    val vigilanceAreas: List<Int>,
)
