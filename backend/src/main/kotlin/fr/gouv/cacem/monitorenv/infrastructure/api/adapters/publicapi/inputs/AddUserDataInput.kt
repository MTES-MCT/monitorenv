package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

data class AddUserDataInput(
    val email: String,
    val isSuperUser: Boolean,
)
