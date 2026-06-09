package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.users

import fr.gouv.cacem.monitorenv.domain.entities.authorization.AuthorizedUser

data class UserAuthorizationDataOutput(
    val isSuperUser: Boolean,
) {
    companion object {
        fun fromUserAuthorization(authorizedUser: AuthorizedUser) =
            UserAuthorizationDataOutput(
                isSuperUser = authorizedUser.isSuperUser,
            )
    }
}
