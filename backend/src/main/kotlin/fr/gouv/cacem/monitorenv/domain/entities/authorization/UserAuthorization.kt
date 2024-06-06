package fr.gouv.cacem.monitorenv.domain.entities.authorization

data class UserAuthorization(
    val hashedEmail: String,
    val isSuperUser: Boolean,
)
