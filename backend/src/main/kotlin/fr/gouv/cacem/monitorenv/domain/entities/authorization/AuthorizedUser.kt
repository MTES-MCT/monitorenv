package fr.gouv.cacem.monitorenv.domain.entities.authorization

data class AuthorizedUser(
    val email: String,
    val isSuperUser: Boolean,
)
