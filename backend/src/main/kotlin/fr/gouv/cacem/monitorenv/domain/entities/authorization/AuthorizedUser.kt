package fr.gouv.cacem.monitorenv.domain.entities.authorization

import java.util.*

data class AuthorizedUser(
    val id: UUID?,
    val email: String?,
    val isSuperUser: Boolean,
)
