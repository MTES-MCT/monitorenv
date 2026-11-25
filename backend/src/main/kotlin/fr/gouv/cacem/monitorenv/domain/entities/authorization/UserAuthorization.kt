package fr.gouv.cacem.monitorenv.domain.entities.authorization

import java.util.*

data class UserAuthorization(
    val id: UUID?,
    val hashedEmail: String,
    val isSuperUser: Boolean,
)
