package fr.gouv.cacem.monitorenv.domain.entities.administration

data class AdministrationEntity(
    val id: Int? = null,
    val isArchived: Boolean,
    val name: String,
)
