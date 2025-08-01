package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization

interface IUserAuthorizationRepository {
    fun findByHashedEmail(hashedEmail: String): UserAuthorization

    fun save(user: UserAuthorization)

    fun delete(hashedEmail: String)
}
