package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.UserAuthorizationModel
import org.springframework.data.jpa.repository.JpaRepository

interface IDBUserAuthorizationRepository : JpaRepository<UserAuthorizationModel, String> {
    fun findByHashedEmail(hashedEmail: String): UserAuthorizationModel
}
