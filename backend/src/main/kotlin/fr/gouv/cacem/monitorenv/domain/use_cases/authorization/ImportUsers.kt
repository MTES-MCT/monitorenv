package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import org.slf4j.LoggerFactory

@UseCase
class ImportUsers(
    private val userAuthorizationRepository: IUserAuthorizationRepository,
) {
    private val logger = LoggerFactory.getLogger(ImportUsers::class.java)

    fun execute(userAuthorizations: List<UserAuthorization>): List<UserAuthorization> {
        logger.info("Attempt to IMPORT ${userAuthorizations.size} users")
        userAuthorizationRepository.saveAll(userAuthorizations)
        logger.info("Imported ${userAuthorizations.size} users")

        return userAuthorizations
    }
}
