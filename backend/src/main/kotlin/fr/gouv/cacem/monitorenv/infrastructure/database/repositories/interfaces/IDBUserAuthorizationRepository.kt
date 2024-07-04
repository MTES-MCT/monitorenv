package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.UserAuthorizationModel
import org.springframework.data.repository.CrudRepository

interface IDBUserAuthorizationRepository : CrudRepository<UserAuthorizationModel, String> {
    fun findByHashedEmail(hashedEmail: String): UserAuthorizationModel
}
