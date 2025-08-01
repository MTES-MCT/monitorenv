package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.authorization.UserAuthorization
import fr.gouv.cacem.monitorenv.domain.repositories.IUserAuthorizationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.UserAuthorizationModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBUserAuthorizationRepository
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.stereotype.Repository

@Repository
class JpaUserAuthorizationRepository(
    private val dbUserAuthorizationRepository: IDBUserAuthorizationRepository,
) : IUserAuthorizationRepository {
    @Cacheable(value = ["user_authorization"])
    override fun findByHashedEmail(hashedEmail: String): UserAuthorization =
        dbUserAuthorizationRepository.findByHashedEmail(hashedEmail).toUserAuthorization()

    @Modifying
    override fun save(user: UserAuthorization) {
        dbUserAuthorizationRepository.save(UserAuthorizationModel.fromUserAuthorization(user))
    }

    @Modifying
    override fun delete(hashedEmail: String) {
        dbUserAuthorizationRepository.deleteById(hashedEmail)
    }
}
