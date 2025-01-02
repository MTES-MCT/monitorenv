package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.hash
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import org.slf4j.LoggerFactory

@UseCase
class DeleteUser(
    private val userAuthorizationRepository: IUserAuthorizationRepository,
) {
    private val logger = LoggerFactory.getLogger(DeleteUser::class.java)

    fun execute(email: String) {
        logger.info("Attempt to DELETE user $email")
        val hashedEmail = hash(email)
        userAuthorizationRepository.delete(hashedEmail)
        logger.info("User $email deleted")
    }
}
