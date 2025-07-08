package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.authorization.AuthorizedUser
import fr.gouv.cacem.monitorenv.domain.hash
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAuthorizedUser(
    private val userAuthorizationRepository: IUserAuthorizationRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAuthorizedUser::class.java)

    fun execute(email: String): AuthorizedUser {
        val hashedEmail = hash(email)
        logger.info("Attempt to GET user $hashedEmail")

        val userEntity = userAuthorizationRepository.findByHashedEmail(hashedEmail)

        return if (userEntity != null) {
            logger.info("Found user $hashedEmail")
            AuthorizedUser(
                email = email,
                isSuperUser = userEntity.isSuperUser,
            )
        } else {
            logger.info("User $hashedEmail not found, defaulting to superUser=false")
            AuthorizedUser(
                email = email,
                isSuperUser = false,
            )
        }
    }
}
