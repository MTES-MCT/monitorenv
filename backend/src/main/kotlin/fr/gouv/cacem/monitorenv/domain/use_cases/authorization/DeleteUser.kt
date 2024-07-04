package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.hash
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository

@UseCase
class DeleteUser(
    private val userAuthorizationRepository: IUserAuthorizationRepository,
) {
    fun execute(email: String) {
        val hashedEmail = hash(email)

        userAuthorizationRepository.delete(hashedEmail)
    }
}
