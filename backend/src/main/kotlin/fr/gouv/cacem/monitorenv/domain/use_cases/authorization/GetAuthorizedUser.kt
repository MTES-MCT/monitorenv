package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.hash
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAuthorizedUser(
    private val userAuthorizationRepository: IUserAuthorizationRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAuthorizedUser::class.java)

    fun execute(email: String): UserAuthorization {
        val hashedEmail = hash(email)
        logger.info("Attempt to GET user $hashedEmail")

        val userAuthorization = userAuthorizationRepository.findByHashedEmail(hashedEmail)

        if (userAuthorization != null) {
            logger.info("Found user $hashedEmail")
            return userAuthorization
        }

        logger.info("User $hashedEmail not found, defaulting to super-user=false")
        return UserAuthorization(
            hashedEmail = hashedEmail,
            isSuperUser = false,
        )
    }
}
