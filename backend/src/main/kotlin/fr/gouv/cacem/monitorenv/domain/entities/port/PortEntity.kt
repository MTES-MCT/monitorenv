package fr.gouv.cacem.monitorenv.domain.entities.port

data class PortEntity(
    val id: Int? = null,
    val controlUnitResourceIds: List<Int>,
    val name: String,
)
