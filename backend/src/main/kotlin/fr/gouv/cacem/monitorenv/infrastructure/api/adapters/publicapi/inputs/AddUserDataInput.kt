package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.hash

data class AddUserDataInput(
    val email: String,
    val isSuperUser: Boolean,
) {
    fun toUserAuthorization(): UserAuthorization =
        UserAuthorization(
            hashedEmail = hash(email),
            isSuperUser = isSuperUser,
        )
}
