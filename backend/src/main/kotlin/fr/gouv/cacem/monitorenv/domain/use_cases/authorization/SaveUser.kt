package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.hash
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository

@UseCase
class SaveUser(
    private val userAuthorizationRepository: IUserAuthorizationRepository,
) {
    fun execute(email: String, isSuperUser: Boolean) {
        val user = UserAuthorization(
            hashedEmail = hash(email),
            isSuperUser = isSuperUser,
        )

        userAuthorizationRepository.save(user)
    }
}
