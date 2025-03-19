package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization

data class UserAuthorizationDataOutput(
    val isSuperUser: Boolean,
) {
    companion object {
        fun fromUserAuthorization(userAuthorization: UserAuthorization): UserAuthorizationDataOutput =
            UserAuthorizationDataOutput(
                isSuperUser = userAuthorization.isSuperUser,
            )
    }
}
