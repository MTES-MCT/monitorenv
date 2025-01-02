package fr.gouv.cacem.monitorenv.domain.use_cases.authorization

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.hash
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import org.slf4j.LoggerFactory

@UseCase
class GetIsAuthorizedUser(
    private val userAuthorizationRepository: IUserAuthorizationRepository,
) {
    private val logger = LoggerFactory.getLogger(GetIsAuthorizedUser::class.java)

    fun execute(
        email: String,
        isSuperUserPath: Boolean,
    ): Boolean {
        /** If the path is not super-user protected, authorize any logged user */
        if (!isSuperUserPath) {
            return true
        }

        /**
         * If the user is not found in the `UserAuthorizationRepository` and the path is super-user
         * protected, reject
         */
        val hashedEmail = hash(email)
        logger.info("Is user $hashedEmail AUTHORIZED")
        return userAuthorizationRepository.findByHashedEmail(hashedEmail)?.isSuperUser ?: false
    }
}
