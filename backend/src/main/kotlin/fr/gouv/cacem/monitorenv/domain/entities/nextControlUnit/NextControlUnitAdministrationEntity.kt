package fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit

data class NextControlUnitAdministrationEntity(
    val id: Int? = null,
    val controlUnitIds: List<Int>? = null,
    val name: String,
)
