package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.users

import fr.gouv.cacem.monitorenv.domain.entities.authorization.AuthorizedUser
import java.util.*

data class UserAuthorizationDataOutput(
    val id: UUID?,
    val isSuperUser: Boolean,
) {
    companion object {
        fun fromUserAuthorization(authorizedUser: AuthorizedUser) =
            UserAuthorizationDataOutput(
                id = authorizedUser.id,
                isSuperUser = authorizedUser.isSuperUser,
            )
    }
}
