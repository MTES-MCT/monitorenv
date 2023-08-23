package fr.gouv.cacem.monitorenv.domain.entities.administration

data class AdministrationEntity(
    val id: Int? = null,
    val controlUnitIds: List<Int>? = null,
    val name: String,
)
