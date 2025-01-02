package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import org.slf4j.LoggerFactory

@UseCase
class SaveUser(
    private val userAuthorizationRepository: IUserAuthorizationRepository,
) {
    private val logger = LoggerFactory.getLogger(SaveUser::class.java)

    fun execute(userAuthorization: UserAuthorization) {
        logger.info("Attempt to CREATE or UPDATE user ${userAuthorization.hashedEmail}")
        userAuthorizationRepository.save(userAuthorization)
        logger.info("User ${userAuthorization.hashedEmail} created or updated")
    }
}
